// Mirrors apps/backend/src/modules/achievements/entities/*.ts

export enum AchievementType {
  MILESTONE = 'milestone',
  HIDDEN = 'hidden',
}

export interface AchievementGridItem {
  id: string;
  key: string;
  type: AchievementType;
  title: string | null;
  quoteOrDescription: string | null;
  unlockConditionText: string | null;
  iconKey: string | null;
  colorKey: string;
  unlocked: boolean;
  unlockedAt: string | null;
  dayNumberAtUnlock: number | null;
  statsSnapshot: {
    baseline: Record<string, number>;
    current: Record<string, number>;
  } | null;
}

export interface AchievementUnlock {
  id: string;
  userId: string;
  achievementId: string;
  achievement: {
    id: string;
    key: string;
    type: AchievementType;
    title: string;
    quoteOrDescription: string;
    unlockConditionText: string;
    iconKey: string;
    colorKey: string;
  };
  programId: string | null;
  unlockedAt: string;
  acknowledgedAt: string | null;
  dayNumberAtUnlock: number | null;
  statsSnapshot: {
    baseline: Record<string, number>;
    current: Record<string, number>;
  } | null;
}
