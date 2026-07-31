// Mirrors apps/backend/src/modules/programs/entities/program.entity.ts

export interface StatSnapshot {
  discipline: number;
  focus: number;
  strength: number;
  confidence: number;
  wisdom: number;
}

export enum ProgramStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}

export interface Program {
  id: string;
  userId: string;
  lengthDays: number;
  startDate: string;
  status: ProgramStatus;
  baselineStats: StatSnapshot;
  currentStats: StatSnapshot;
  currentDay: number;
  streakCount: number;
  longestStreak: number;
  totalXp: number;
  currentLevel: number;
}
