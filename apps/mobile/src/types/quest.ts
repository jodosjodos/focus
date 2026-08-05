// Mirrors apps/backend/src/modules/quests/entities/*.ts

export enum QuestType {
  CHECKBOX = 'checkbox',
  QUANTITY = 'quantity',
  DURATION = 'duration',
  READING = 'reading',
  VIDEO = 'video',
  WORKOUT = 'workout',
}

export enum QuestDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum QuestCategory {
  STRENGTH = 'Strength',
  DISCIPLINE = 'Discipline',
  FOCUS = 'Focus',
  WISDOM = 'Wisdom',
  CONFIDENCE = 'Confidence',
  CUSTOM = 'Custom',
}

export enum QuestStatus {
  PENDING = 'pending',
  COMPLETE = 'complete',
  SKIPPED = 'skipped',
}

export interface GeneratedQuest {
  templateId: string;
  title: string;
  description: string;
  questType: QuestType;
  primaryStat: QuestCategory;
  secondaryStat: QuestCategory | null;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  baseXp: number;
  target: string | null;
  isMainQuest: boolean;
  isBonusQuest: boolean;
}

export interface Quest {
  id: string;
  programId: string;
  questTemplateId: string;
  dayNumber: number;
  isMainQuest: boolean;
  isBonusQuest: boolean;
  status: QuestStatus;
  loggedValue: string | null;
  xpAwarded: number;
  completedAt: string | null;
  resolvedDifficulty: QuestDifficulty;
  resolvedTarget: string | null;
}
