import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quest, QuestStatus } from './entities/quest.entity';
import { QuestCategory, QuestTemplate } from './entities/quest-template.entity';
import { Program, StatSnapshot } from '../programs/entities/program.entity';
import { STAT_GAIN_BY_DIFFICULTY, XP_BY_DIFFICULTY, levelForXp } from './xp.constants';

const STAT_KEY_BY_CATEGORY: Partial<Record<QuestCategory, keyof StatSnapshot>> = {
  [QuestCategory.STRENGTH]: 'strength',
  [QuestCategory.DISCIPLINE]: 'discipline',
  [QuestCategory.FOCUS]: 'focus',
  [QuestCategory.WISDOM]: 'wisdom',
  [QuestCategory.CONFIDENCE]: 'confidence',
  // CUSTOM intentionally omitted — a Custom-category template's primary/
  // secondary stat should always be one of the 5 real stats (per the docs,
  // "Custom: user-assigned at creation"), never the literal category name.
};

@Injectable()
export class QuestCompletionService {
  constructor(
    @InjectRepository(Quest)
    private readonly questsRepository: Repository<Quest>,
    @InjectRepository(QuestTemplate)
    private readonly templatesRepository: Repository<QuestTemplate>,
    @InjectRepository(Program)
    private readonly programsRepository: Repository<Program>,
  ) {}

  async complete(questId: string, loggedValue?: string): Promise<Quest> {
    const quest = await this.getPendingQuestOrThrow(questId);
    const template = await this.templatesRepository.findOneOrFail({
      where: { id: quest.questTemplateId },
    });

    const gain = STAT_GAIN_BY_DIFFICULTY[quest.resolvedDifficulty];
    const xpAwarded = XP_BY_DIFFICULTY[quest.resolvedDifficulty];

    const program = await this.programsRepository.findOneOrFail({
      where: { id: quest.programId },
    });

    const nextStats = this.applyStatGain(
      program.currentStats,
      template.primaryStat,
      gain.primary,
      template.secondaryStat,
      gain.secondary,
    );

    program.currentStats = nextStats;
    program.totalXp += xpAwarded;
    program.currentLevel = levelForXp(program.totalXp);
    await this.programsRepository.save(program);

    quest.status = QuestStatus.COMPLETE;
    quest.xpAwarded = xpAwarded;
    quest.completedAt = new Date();
    quest.loggedValue = loggedValue ?? null;
    await this.questsRepository.save(quest);

    await this.checkDayComplete(quest.programId, quest.dayNumber);

    return quest;
  }

  async skip(questId: string): Promise<Quest> {
    const quest = await this.getPendingQuestOrThrow(questId);
    quest.status = QuestStatus.SKIPPED;
    await this.questsRepository.save(quest);

    await this.checkDayComplete(quest.programId, quest.dayNumber);

    return quest;
  }

  /** Moves a skipped quest back to pending — skip never touched XP/stats, so this is a plain status flip. */
  async restore(questId: string): Promise<Quest> {
    const quest = await this.questsRepository.findOne({ where: { id: questId } });
    if (!quest) {
      throw new NotFoundException('Quest not found');
    }
    if (quest.status !== QuestStatus.SKIPPED) {
      throw new ConflictException(`Quest is ${quest.status}, not skipped`);
    }
    quest.status = QuestStatus.PENDING;
    await this.questsRepository.save(quest);
    return quest;
  }

  private async getPendingQuestOrThrow(questId: string): Promise<Quest> {
    const quest = await this.questsRepository.findOne({
      where: { id: questId },
    });
    if (!quest) {
      throw new NotFoundException('Quest not found');
    }
    if (quest.status !== QuestStatus.PENDING) {
      throw new ConflictException(`Quest already ${quest.status}`);
    }
    return quest;
  }

  private applyStatGain(
    stats: StatSnapshot,
    primaryStat: QuestCategory,
    primaryGain: number,
    secondaryStat: QuestCategory | null,
    secondaryGain: number,
  ): StatSnapshot {
    const next = { ...stats };
    const primaryKey = STAT_KEY_BY_CATEGORY[primaryStat];
    if (primaryKey) {
      next[primaryKey] = Math.min(100, next[primaryKey] + primaryGain);
    }

    const secondaryKey = secondaryStat
      ? STAT_KEY_BY_CATEGORY[secondaryStat]
      : undefined;
    if (secondaryKey) {
      next[secondaryKey] = Math.min(100, next[secondaryKey] + secondaryGain);
    }

    return next;
  }

  /** Streak increments once every quest for the day is complete or skipped. */
  private async checkDayComplete(
    programId: string,
    dayNumber: number,
  ): Promise<void> {
    const dayQuests = await this.questsRepository.find({
      where: { programId, dayNumber },
    });
    const stillPending = dayQuests.some(
      (q) => q.status === QuestStatus.PENDING,
    );
    if (stillPending || dayQuests.length === 0) {
      return;
    }

    const program = await this.programsRepository.findOneOrFail({
      where: { id: programId },
    });
    program.streakCount += 1;
    program.longestStreak = Math.max(program.longestStreak, program.streakCount);
    await this.programsRepository.save(program);
  }
}
