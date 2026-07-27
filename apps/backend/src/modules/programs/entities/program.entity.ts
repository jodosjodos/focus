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
}
