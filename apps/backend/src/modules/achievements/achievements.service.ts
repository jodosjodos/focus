import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Achievement, AchievementType } from './entities/achievement.entity';
import { AchievementUnlock } from './entities/achievement-unlock.entity';
import { StatSnapshot } from '../programs/entities/program.entity';

interface UnlockParams {
  userId: string;
  achievementId: string;
  programId: string | null;
  dayNumberAtUnlock: number | null;
  statsSnapshot?: { baseline: StatSnapshot; current: StatSnapshot } | null;
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === '23505'
  );
}

@Injectable()
export class AchievementsService {
  constructor(
    @InjectRepository(Achievement)
    private readonly achievementsRepository: Repository<Achievement>,
    @InjectRepository(AchievementUnlock)
    private readonly unlocksRepository: Repository<AchievementUnlock>,
  ) {}

  /** Idempotent — safe to call even if this achievement is already unlocked
   * for the user (guarded by the UNIQUE(userId, achievementId) constraint). */
  async unlock(params: UnlockParams): Promise<AchievementUnlock> {
    const existing = await this.unlocksRepository.findOne({
      where: { userId: params.userId, achievementId: params.achievementId },
    });
    if (existing) {
      return existing;
    }

    try {
      return await this.unlocksRepository.save(
        this.unlocksRepository.create({
          userId: params.userId,
          achievementId: params.achievementId,
          programId: params.programId,
          dayNumberAtUnlock: params.dayNumberAtUnlock,
          statsSnapshot: params.statsSnapshot ?? null,
        }),
      );
    } catch (error) {
      if (isUniqueViolation(error)) {
        return this.unlocksRepository.findOneOrFail({
          where: { userId: params.userId, achievementId: params.achievementId },
        });
      }
      throw error;
    }
  }

  async getGrid(userId: string): Promise<
    Array<{
      id: string;
      key: string;
      type: AchievementType;
      title: string | null;
      quoteOrDescription: string | null;
      unlockConditionText: string | null;
      iconKey: string | null;
      colorKey: string;
      unlocked: boolean;
      unlockedAt: Date | null;
      dayNumberAtUnlock: number | null;
      statsSnapshot: { baseline: StatSnapshot; current: StatSnapshot } | null;
    }>
  > {
    const achievements = await this.achievementsRepository.find();
    const unlocks = await this.unlocksRepository.find({
      where: { userId },
    });
    const unlockByAchievementId = new Map(
      unlocks.map((u) => [u.achievementId, u]),
    );

    return achievements.map((a) => {
      const unlock = unlockByAchievementId.get(a.id);
      const unlocked = !!unlock;
      // Hidden achievements keep the mystery until unlocked; milestone
      // achievements show their (non-secret) title/condition even locked.
      const revealLockedText = a.type === AchievementType.MILESTONE;

      return {
        id: a.id,
        key: a.key,
        type: a.type,
        title: unlocked || revealLockedText ? a.title : null,
        quoteOrDescription: unlocked ? a.quoteOrDescription : null,
        unlockConditionText:
          unlocked || revealLockedText ? a.unlockConditionText : null,
        iconKey: unlocked ? a.iconKey : null,
        colorKey: a.colorKey,
        unlocked,
        unlockedAt: unlock?.unlockedAt ?? null,
        dayNumberAtUnlock: unlock?.dayNumberAtUnlock ?? null,
        statsSnapshot: unlock?.statsSnapshot ?? null,
      };
    });
  }

  getPendingUnlocks(userId: string): Promise<AchievementUnlock[]> {
    return this.unlocksRepository.find({
      where: { userId, acknowledgedAt: IsNull() },
      relations: { achievement: true },
    });
  }

  async acknowledge(unlockId: string, userId: string): Promise<AchievementUnlock> {
    const unlock = await this.unlocksRepository.findOneOrFail({
      where: { id: unlockId },
    });
    if (unlock.userId !== userId) {
      throw new ForbiddenException("Cannot acknowledge another user's unlock");
    }
    unlock.acknowledgedAt = new Date();
    return this.unlocksRepository.save(unlock);
  }
}
