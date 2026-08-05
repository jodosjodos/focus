import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement, AchievementType } from './entities/achievement.entity';
import { Program } from '../programs/entities/program.entity';
import { AchievementsService } from './achievements.service';
import { computeScaledMilestoneDays } from './milestone.constants';

@Injectable()
export class MilestoneService {
  constructor(
    @InjectRepository(Achievement)
    private readonly achievementsRepository: Repository<Achievement>,
    private readonly achievementsService: AchievementsService,
  ) {}

  async checkAndUnlock(program: Program, dayNumber: number): Promise<void> {
    const scaledDays = computeScaledMilestoneDays(program.lengthDays);
    const matchedIndices = scaledDays.reduce<number[]>(
      (acc, day, index) => (day === dayNumber ? [...acc, index] : acc),
      [],
    );
    if (matchedIndices.length === 0) {
      return;
    }

    for (const index of matchedIndices) {
      const achievement = await this.achievementsRepository.findOne({
        where: { type: AchievementType.MILESTONE, milestoneCheckpointIndex: index },
      });
      if (!achievement) {
        // Seed-content gap — don't let a missing achievement row break
        // quest-completion for the user.
        continue;
      }

      await this.achievementsService.unlock({
        userId: program.userId,
        achievementId: achievement.id,
        programId: program.id,
        dayNumberAtUnlock: dayNumber,
        statsSnapshot: {
          baseline: program.baselineStats,
          current: program.currentStats,
        },
      });
    }
  }
}
