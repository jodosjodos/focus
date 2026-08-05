import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { MotivationCard, MotivationCardRarity } from './entities/motivation-card.entity';
import { MotivationCardPull } from './entities/motivation-card-pull.entity';
import { Program } from '../programs/entities/program.entity';

const RARITY_ODDS: [MotivationCardRarity, number][] = [
  [MotivationCardRarity.COMMON, 0.6],
  [MotivationCardRarity.RARE, 0.25],
  [MotivationCardRarity.MASTER_RARE, 0.12],
  [MotivationCardRarity.X_RARE, 0.03],
];

const SEQUENCE_BY_RARITY: Record<MotivationCardRarity, string> = {
  [MotivationCardRarity.COMMON]: 'motivation_card_serial_common_seq',
  [MotivationCardRarity.RARE]: 'motivation_card_serial_rare_seq',
  [MotivationCardRarity.MASTER_RARE]: 'motivation_card_serial_master_rare_seq',
  [MotivationCardRarity.X_RARE]: 'motivation_card_serial_x_rare_seq',
};

const SERIAL_PREFIX: Record<MotivationCardRarity, string> = {
  [MotivationCardRarity.COMMON]: 'C',
  [MotivationCardRarity.RARE]: 'R',
  [MotivationCardRarity.MASTER_RARE]: 'M',
  [MotivationCardRarity.X_RARE]: 'X',
};

@Injectable()
export class MotivationCardsService {
  constructor(
    @InjectRepository(MotivationCard)
    private readonly cardsRepository: Repository<MotivationCard>,
    @InjectRepository(MotivationCardPull)
    private readonly pullsRepository: Repository<MotivationCardPull>,
    @InjectRepository(Program)
    private readonly programsRepository: Repository<Program>,
  ) {}

  private rollRarity(): MotivationCardRarity {
    const roll = Math.random();
    let cumulative = 0;
    for (const [rarity, odds] of RARITY_ODDS) {
      cumulative += odds;
      if (roll < cumulative) {
        return rarity;
      }
    }
    return MotivationCardRarity.COMMON;
  }

  private computeLogicalDateKey(timezone: string): string {
    // Same 4am-rollover semantics as ProgramsService.computeRawDay(), so a
    // day's single pull doesn't flip over mid-sleep.
    return DateTime.now().setZone(timezone).minus({ hours: 4 }).toISODate()!;
  }

  private async nextSerial(rarity: MotivationCardRarity): Promise<string> {
    const sequenceName = SEQUENCE_BY_RARITY[rarity];
    const [{ n }]: [{ n: string }] = await this.pullsRepository.manager.query(
      `SELECT nextval('${sequenceName}') as n`,
    );
    return `${SERIAL_PREFIX[rarity]}${String(n).padStart(3, '0')}`;
  }

  private async toResponse(pull: MotivationCardPull) {
    const card = await this.cardsRepository.findOneOrFail({
      where: { id: pull.motivationCardId },
    });
    return {
      id: pull.id,
      quoteText: card.quoteText,
      rarity: pull.rarity,
      serial: pull.serial,
      pulledForDate: pull.pulledForDate,
      acknowledgedAt: pull.acknowledgedAt,
    };
  }

  async pullForToday(userId: string, programId?: string) {
    const program = programId
      ? await this.programsRepository.findOne({ where: { id: programId } })
      : null;
    const dateKey = this.computeLogicalDateKey(program?.timezone ?? 'UTC');

    const existing = await this.pullsRepository.findOne({
      where: { userId, pulledForDate: dateKey },
    });
    if (existing) {
      return this.toResponse(existing);
    }

    const rarity = this.rollRarity();
    const pool = await this.cardsRepository.find({ where: { rarity } });
    if (pool.length === 0) {
      throw new InternalServerErrorException(
        `No MotivationCard seeded for rarity ${rarity}`,
      );
    }

    const areas = new Set(program?.improvementAreas ?? []);
    const weighted = pool.map((card) => ({
      card,
      weight: card.tags.some((t) => areas.has(t)) ? 3 : 1,
    }));
    const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0);
    let roll = Math.random() * totalWeight;
    let chosen = weighted[0].card;
    for (const w of weighted) {
      roll -= w.weight;
      if (roll <= 0) {
        chosen = w.card;
        break;
      }
    }

    const serial = await this.nextSerial(rarity);
    const pull = this.pullsRepository.create({
      userId,
      motivationCardId: chosen.id,
      programId: program?.id ?? null,
      pulledForDate: dateKey,
      rarity,
      serial,
      acknowledgedAt: null,
    });

    try {
      const saved = await this.pullsRepository.save(pull);
      return this.toResponse(saved);
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        // Race: another request pulled for today first.
        const raced = await this.pullsRepository.findOneOrFail({
          where: { userId, pulledForDate: dateKey },
        });
        return this.toResponse(raced);
      }
      throw error;
    }
  }

  private isUniqueViolation(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: string }).code === '23505'
    );
  }

  async acknowledge(pullId: string, userId: string): Promise<MotivationCardPull> {
    const pull = await this.pullsRepository.findOneOrFail({ where: { id: pullId } });
    if (pull.userId !== userId) {
      throw new ForbiddenException("Cannot acknowledge another user's pull");
    }
    pull.acknowledgedAt = new Date();
    return this.pullsRepository.save(pull);
  }
}
