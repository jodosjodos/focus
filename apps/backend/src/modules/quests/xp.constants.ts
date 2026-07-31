import { QuestDifficulty } from './entities/quest-template.entity';

// project-description §5.1
export const XP_BY_DIFFICULTY: Record<QuestDifficulty, number> = {
  [QuestDifficulty.EASY]: 10,
  [QuestDifficulty.MEDIUM]: 20,
  [QuestDifficulty.HARD]: 35,
};

export const XP_PER_LEVEL = 500;

export function levelForXp(totalXp: number): number {
  return Math.floor(totalXp / XP_PER_LEVEL) + 1;
}

// Assumption (see docs/DEFERRED-IMPLEMENTATION.md) — docs give no exact
// stat-gain number per quest, only XP. Mirrors the XP tiers' shape.
export const STAT_GAIN_BY_DIFFICULTY: Record<
  QuestDifficulty,
  { primary: number; secondary: number }
> = {
  [QuestDifficulty.EASY]: { primary: 2, secondary: 1 },
  [QuestDifficulty.MEDIUM]: { primary: 3, secondary: 1 },
  [QuestDifficulty.HARD]: { primary: 4, secondary: 2 },
};
