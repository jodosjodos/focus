import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Program } from '../../programs/entities/program.entity';
import { QuestTemplate } from './quest-template.entity';

export enum QuestStatus {
  PENDING = 'pending',
  COMPLETE = 'complete',
  SKIPPED = 'skipped',
}

@Entity('quests')
export class Quest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  programId: string;

  @ManyToOne(() => Program)
  @JoinColumn({ name: 'programId' })
  program: Program;

  @Column()
  questTemplateId: string;

  @ManyToOne(() => QuestTemplate)
  @JoinColumn({ name: 'questTemplateId' })
  questTemplate: QuestTemplate;

  @Column({ type: 'int' })
  dayNumber: number;

  @Column({ default: false })
  isMainQuest: boolean;

  @Column({ default: false })
  isBonusQuest: boolean;

  @Column({ type: 'enum', enum: QuestStatus, default: QuestStatus.PENDING })
  status: QuestStatus;

  @Column({ type: 'varchar', nullable: true })
  loggedValue: string | null;

  @Column({ type: 'int', default: 0 })
  xpAwarded: number;

  @Column({ type: 'timestamptz', nullable: true })
  completedAt: Date | null;
}
