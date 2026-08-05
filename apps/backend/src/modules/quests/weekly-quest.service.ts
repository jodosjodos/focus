import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeeklyQuest, WeeklyQuestStatus } from './entities/weekly-quest.entity';
import { QuestCategory } from './entities/quest-template.entity';
import { Program } from '../programs/entities/program.entity';
import { levelForXp } from './xp.constants';
import { AREA_CATEGORY_MAP } from './plan-generation.service';

// project-description §5.3 Step 6 — doc gives examples ("finish one book
// this week") but never a completion XP number. Flat placeholder, isolated
// here so it's easy to tune later.
const WEEKLY_QUEST_BONUS_XP = 100;

@Injectable()
export class WeeklyQuestService {
  constructor(
    @InjectRepository(WeeklyQuest)
    private readonly weeklyQuestsRepository: Repository<WeeklyQuest>,
    @InjectRepository(Program)
    private readonly programsRepository: Repository<Program>,
  ) {}

  private targetCountFor(programLengthDays: number): number {
    return programLengthDays <= 30 ? 4 : 5;
  }

  async ensureWeekExists(program: Program, day: number): Promise<WeeklyQuest> {
    const weekIndex = Math.floor((day - 1) / 7);
    const existing = await this.weeklyQuestsRepository.findOne({
      where: { programId: program.id, weekIndex },
    });
    if (existing) {
      return existing;
    }

    await this.resolveDanglingPreviousWeek(program.id, weekIndex);

    const startDay = weekIndex * 7 + 1;
    const endDay = Math.min(startDay + 6, program.lengthDays);
    // "Top-weighted" = first area chosen in the quiz — order is preserved
    // end-to-end through the jsonb column.
    const category = AREA_CATEGORY_MAP[program.improvementAreas[0]][0];

    const week = this.weeklyQuestsRepository.create({
      programId: program.id,
      weekIndex,
      startDay,
      endDay,
      category,
      targetCount: this.targetCountFor(program.lengthDays),
      progressCount: 0,
      status: WeeklyQuestStatus.ACTIVE,
      xpAwarded: 0,
    });
    return this.weeklyQuestsRepository.save(week);
  }

  private async resolveDanglingPreviousWeek(
    programId: string,
    newWeekIndex: number,
  ): Promise<void> {
    if (newWeekIndex === 0) {
      return;
    }
    const prev = await this.weeklyQuestsRepository.findOne({
      where: { programId, weekIndex: newWeekIndex - 1, status: WeeklyQuestStatus.ACTIVE },
    });
    if (!prev) {
      return;
    }
    prev.status =
      prev.progressCount >= prev.targetCount
        ? WeeklyQuestStatus.COMPLETE
        : WeeklyQuestStatus.FAILED;
    prev.resolvedAt = new Date();
    await this.weeklyQuestsRepository.save(prev);
  }

  async resolveFinalWeekOnProgramComplete(program: Program): Promise<void> {
    const weekIndex = Math.floor((program.lengthDays - 1) / 7);
    const week = await this.weeklyQuestsRepository.findOne({
      where: { programId: program.id, weekIndex, status: WeeklyQuestStatus.ACTIVE },
    });
    if (!week) {
      return;
    }
    week.status =
      week.progressCount >= week.targetCount
        ? WeeklyQuestStatus.COMPLETE
        : WeeklyQuestStatus.FAILED;
    week.resolvedAt = new Date();
    await this.weeklyQuestsRepository.save(week);
  }

  async recordProgress(
    programId: string,
    dayNumber: number,
    category: QuestCategory,
  ): Promise<void> {
    const weekIndex = Math.floor((dayNumber - 1) / 7);
    const week = await this.weeklyQuestsRepository.findOne({
      where: { programId, weekIndex, status: WeeklyQuestStatus.ACTIVE },
    });
    if (
      !week ||
      week.category !== category ||
      dayNumber < week.startDay ||
      dayNumber > week.endDay
    ) {
      return;
    }

    week.progressCount += 1;
    if (week.progressCount >= week.targetCount) {
      week.status = WeeklyQuestStatus.COMPLETE;
      week.resolvedAt = new Date();
      week.xpAwarded = WEEKLY_QUEST_BONUS_XP;

      const program = await this.programsRepository.findOneOrFail({
        where: { id: programId },
      });
      program.totalXp += WEEKLY_QUEST_BONUS_XP;
      program.currentLevel = levelForXp(program.totalXp);
      await this.programsRepository.save(program);
    }
    await this.weeklyQuestsRepository.save(week);
  }

  async getCurrent(programId: string): Promise<WeeklyQuest | null> {
    const program = await this.programsRepository.findOneOrFail({
      where: { id: programId },
    });
    const weekIndex = Math.floor((program.currentDay - 1) / 7);
    return this.weeklyQuestsRepository.findOne({ where: { programId, weekIndex } });
  }
}
