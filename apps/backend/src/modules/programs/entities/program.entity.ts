import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ProgramStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}

export interface StatSnapshot {
  discipline: number;
  focus: number;
  strength: number;
  confidence: number;
  wisdom: number;
}

// Quiz answer tiers — docs/FOCUS-app-structure-and-screen-flow.md §3, Screens 2-5
export enum SleepHoursTier {
  UNDER_5 = 'under_5h',
  FIVE_TO_SIX = '5-6h',
  SIX_TO_SEVEN = '6-7h',
  SEVEN_TO_EIGHT = '7-8h',
  EIGHT_PLUS = '8h+',
}

export enum WaterLitersTier {
  UNDER_1L = 'under_1L',
  ONE_TO_TWO_L = '1-2L',
  TWO_TO_THREE_L = '2-3L',
  THREE_PLUS_L = '3L+',
}

export enum ExerciseFrequencyTier {
  NEVER = 'never',
  ONE_TO_TWO = '1-2x',
  THREE_PLUS = '3+x',
}

export enum ScreenTimeHoursTier {
  UNDER_2 = 'under_2h',
  TWO_TO_FOUR = '2-4h',
  FOUR_TO_SIX = '4-6h',
  SIX_PLUS = '6h+',
}

export enum ImprovementArea {
  SLEEP = 'Sleep',
  BODY = 'Body',
  FOCUS = 'Focus',
  DISCIPLINE = 'Discipline',
  CONFIDENCE = 'Confidence',
  MIND = 'Mind',
  WEALTH = 'Wealth',
  RELATIONSHIPS = 'Relationships',
  CAREER = 'Career',
  HABITS = 'Habits',
}

export interface OnboardingBaseline {
  sleepHours: SleepHoursTier;
  waterLiters: WaterLitersTier;
  exerciseFrequency: ExerciseFrequencyTier;
  screenTimeHours: ScreenTimeHoursTier;
}

@Entity('programs')
export class Program {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'int' })
  lengthDays: number;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'enum', enum: ProgramStatus, default: ProgramStatus.ACTIVE })
  status: ProgramStatus;

  @Column({ type: 'jsonb' })
  baselineStats: StatSnapshot;

  @Column({ type: 'jsonb' })
  currentStats: StatSnapshot;

  @Column({ type: 'int', default: 1 })
  currentDay: number;

  // Streak fields (per development plan §2)
  @Column({ type: 'int', default: 0 })
  streakCount: number;

  @Column({ type: 'int', default: 0 })
  longestStreak: number;

  @Column({ type: 'int', default: 0 })
  totalXp: number;

  @Column({ type: 'int', default: 1 })
  currentLevel: number;

  // Onboarding fields (Phase 1) — needed to lazily regenerate each day's quests
  @Column({ type: 'jsonb' })
  improvementAreas: ImprovementArea[];

  @Column({ type: 'jsonb' })
  baseline: OnboardingBaseline;

  @Column({ type: 'varchar', nullable: true })
  notWorkingText: string | null;

  @Column({ type: 'varchar' })
  timezone: string;
}
