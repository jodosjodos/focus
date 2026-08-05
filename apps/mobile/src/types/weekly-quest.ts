// Mirrors apps/backend/src/modules/quests/entities/weekly-quest.entity.ts
import { QuestCategory } from './quest';

export enum WeeklyQuestStatus {
  ACTIVE = 'active',
  COMPLETE = 'complete',
  FAILED = 'failed',
}

export interface WeeklyQuest {
  id: string;
  programId: string;
  weekIndex: number;
  startDay: number;
  endDay: number;
  category: QuestCategory;
  targetCount: number;
  progressCount: number;
  status: WeeklyQuestStatus;
  xpAwarded: number;
  resolvedAt: string | null;
}
