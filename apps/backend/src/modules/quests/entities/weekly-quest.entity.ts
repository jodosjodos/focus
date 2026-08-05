import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Program } from '../../programs/entities/program.entity';
import { QuestCategory } from './quest-template.entity';

export enum WeeklyQuestStatus {
  ACTIVE = 'active',
  COMPLETE = 'complete',
  FAILED = 'failed',
}

@Entity('weekly_quests')
@Index(['programId', 'weekIndex'], { unique: true })
export class WeeklyQuest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  programId: string;

  @ManyToOne(() => Program)
  @JoinColumn({ name: 'programId' })
  program: Program;

  // 0-based — floor((dayNumber-1)/7).
  @Column({ type: 'int' })
  weekIndex: number;

  @Column({ type: 'int' })
  startDay: number;

  @Column({ type: 'int' })
  endDay: number;

  @Column({ type: 'enum', enum: QuestCategory })
  category: QuestCategory;

  @Column({ type: 'int' })
  targetCount: number;

  @Column({ type: 'int', default: 0 })
  progressCount: number;

  @Column({ type: 'enum', enum: WeeklyQuestStatus, default: WeeklyQuestStatus.ACTIVE })
  status: WeeklyQuestStatus;

  @Column({ type: 'int', default: 0 })
  xpAwarded: number;

  @Column({ type: 'timestamptz', nullable: true })
  resolvedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
