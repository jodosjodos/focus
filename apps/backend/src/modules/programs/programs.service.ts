import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateTime } from 'luxon';
import { Program, ProgramStatus } from './entities/program.entity';
import { Quest, QuestStatus } from '../quests/entities/quest.entity';
import { PlanGenerationService } from '../quests/plan-generation.service';
import { computeDay1Rating, computePotentialStats } from './rating.util';
import { PreviewProgramDto } from './dto/preview-program.dto';
import { SwapTemplateDto } from './dto/swap-template.dto';
import { CreateProgramDto } from './dto/create-program.dto';

@Injectable()
export class ProgramsService {
  constructor(
    @InjectRepository(Program)
    private readonly programsRepository: Repository<Program>,
    @InjectRepository(Quest)
    private readonly questsRepository: Repository<Quest>,
    private readonly planGenerationService: PlanGenerationService,
  ) {}

  async preview(dto: PreviewProgramDto) {
    const baselineStats = computeDay1Rating(dto.baseline);
    const potentialStats = computePotentialStats(baselineStats);
    const quests = await this.planGenerationService.generateDay({
      improvementAreas: dto.improvementAreas,
      baseline: dto.baseline,
      programLength: dto.programLength,
      dayNumber: 1,
    });

    return {
      baselineStats,
      potentialStats,
      notWorkingText: dto.notWorkingText ?? null,
      quests,
    };
  }

  async swapTemplate(dto: SwapTemplateDto) {
    const alternate = await this.planGenerationService.findAlternateTemplate(
      dto.category,
      dto.excludeTemplateId,
    );
    if (!alternate) {
      throw new NotFoundException(
        'No alternate QuestTemplate available in this category',
      );
    }

    const scaled = this.planGenerationService.applyBaselineScaling(
      alternate,
      dto.baseline,
    );

    return {
      templateId: alternate.id,
      title: alternate.title,
      description: alternate.description,
      questType: alternate.questType,
      primaryStat: alternate.primaryStat,
      secondaryStat: alternate.secondaryStat,
      category: alternate.category,
      difficulty: scaled.difficulty,
      baseXp: scaled.baseXp,
      target: scaled.target,
    };
  }

  async create(userId: string, dto: CreateProgramDto): Promise<Program> {
    const baselineStats = computeDay1Rating(dto.baseline);
    const startDate = DateTime.now().setZone(dto.timezone).toISODate();

    const program = this.programsRepository.create({
      userId,
      lengthDays: dto.lengthDays,
      startDate: startDate ?? DateTime.now().toISODate()!,
      status: ProgramStatus.ACTIVE,
      baselineStats,
      currentStats: { ...baselineStats },
      currentDay: 1,
      streakCount: 0,
      longestStreak: 0,
      totalXp: 0,
      currentLevel: 1,
      improvementAreas: dto.improvementAreas,
      baseline: dto.baseline,
      notWorkingText: dto.notWorkingText ?? null,
      timezone: dto.timezone,
    });
    await this.programsRepository.save(program);

    const day1Quests = await Promise.all(
      dto.quests.map(async (selection) => {
        const template = await this.planGenerationService.getTemplateOrThrow(
          selection.templateId,
        );
        const scaled = this.planGenerationService.applyBaselineScaling(
          template,
          dto.baseline,
        );
        return this.questsRepository.create({
          programId: program.id,
          questTemplateId: template.id,
          dayNumber: 1,
          isMainQuest: selection.isMainQuest,
          isBonusQuest: false,
          status: QuestStatus.PENDING,
          resolvedDifficulty: scaled.difficulty,
          resolvedTarget: scaled.target,
        });
      }),
    );
    await this.questsRepository.save(day1Quests);

    return program;
  }

  async findByIdOrThrow(id: string): Promise<Program> {
    const program = await this.programsRepository.findOne({ where: { id } });
    if (!program) {
      throw new NotFoundException('Program not found');
    }
    return program;
  }

  findAllForUser(userId: string): Promise<Program[]> {
    return this.programsRepository.find({ where: { userId } });
  }

  /** Computes the live day number from start_date + timezone + 4am cutoff. */
  private computeRawDay(program: Program): number {
    const rollover = DateTime.fromISO(program.startDate, {
      zone: program.timezone,
    })
      .startOf('day')
      .plus({ hours: 4 });
    const now = DateTime.now().setZone(program.timezone);

    if (now < rollover) {
      return 1;
    }
    return 1 + Math.floor(now.diff(rollover, 'days').days);
  }

  async getTodayQuests(programId: string) {
    const program = await this.findByIdOrThrow(programId);
    const rawDay = this.computeRawDay(program);
    const day = Math.min(rawDay, program.lengthDays);
    const programJustCompleted =
      rawDay > program.lengthDays && program.status === ProgramStatus.ACTIVE;

    if (programJustCompleted) {
      program.status = ProgramStatus.COMPLETED;
    }
    if (program.currentDay !== day) {
      program.currentDay = day;
    }
    if (programJustCompleted || program.currentDay !== day) {
      await this.programsRepository.save(program);
    }

    let dayQuests = await this.questsRepository.find({
      where: { programId, dayNumber: day },
      relations: { questTemplate: true },
    });

    if (dayQuests.length === 0) {
      const generated = await this.planGenerationService.generateDay({
        improvementAreas: program.improvementAreas,
        baseline: program.baseline,
        programLength: program.lengthDays,
        dayNumber: day,
      });

      const created = generated.map((g) =>
        this.questsRepository.create({
          programId,
          questTemplateId: g.templateId,
          dayNumber: day,
          isMainQuest: g.isMainQuest,
          isBonusQuest: false,
          status: QuestStatus.PENDING,
          resolvedDifficulty: g.difficulty,
          resolvedTarget: g.target,
        }),
      );
      await this.questsRepository.save(created);
      dayQuests = await this.questsRepository.find({
        where: { programId, dayNumber: day },
        relations: { questTemplate: true },
      });
    }

    return {
      day,
      lengthDays: program.lengthDays,
      programComplete: program.status === ProgramStatus.COMPLETED,
      quests: dayQuests.map((quest) => ({
        id: quest.id,
        questTemplateId: quest.questTemplateId,
        dayNumber: quest.dayNumber,
        isMainQuest: quest.isMainQuest,
        isBonusQuest: quest.isBonusQuest,
        status: quest.status,
        loggedValue: quest.loggedValue,
        xpAwarded: quest.xpAwarded,
        completedAt: quest.completedAt,
        resolvedDifficulty: quest.resolvedDifficulty,
        resolvedTarget: quest.resolvedTarget,
        title: quest.questTemplate.title,
        description: quest.questTemplate.description,
        questType: quest.questTemplate.questType,
        primaryStat: quest.questTemplate.primaryStat,
        secondaryStat: quest.questTemplate.secondaryStat,
        category: quest.questTemplate.category,
      })),
    };
  }

  async getStats(programId: string) {
    const program = await this.findByIdOrThrow(programId);
    const totalQuestsCompleted = await this.questsRepository.count({
      where: { programId, status: QuestStatus.COMPLETE },
    });
    return {
      current: program.currentStats,
      potential: computePotentialStats(program.baselineStats),
      totalXp: program.totalXp,
      currentLevel: program.currentLevel,
      streakCount: program.streakCount,
      longestStreak: program.longestStreak,
      totalQuestsCompleted,
    };
  }
}
