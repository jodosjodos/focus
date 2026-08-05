import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Program } from '../../programs/entities/program.entity';
import { QuestDifficulty, QuestTemplate } from './quest-template.entity';

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

  // Set true inside restore() — lets hidden-achievement rules (e.g.
  // "Comeback") detect a skipped quest that was brought back and finished.
  @Column({ default: false })
  wasRestored: boolean;

  @Column({ type: 'enum', enum: QuestStatus, default: QuestStatus.PENDING })
  status: QuestStatus;

  @Column({ type: 'varchar', nullable: true })
  loggedValue: string | null;

  @Column({ type: 'int', default: 0 })
  xpAwarded: number;

  @Column({ type: 'timestamptz', nullable: true })
  completedAt: Date | null;

  // Snapshot of plan-generation's baseline-scaled output (project-description
  // §5.3 Step 3) — the template's own difficulty/target may differ once
  // scaled per-user, so completion logic must use these, not the template's.
  @Column({ type: 'enum', enum: QuestDifficulty })
  resolvedDifficulty: QuestDifficulty;

  @Column({ type: 'varchar', nullable: true })
  resolvedTarget: string | null;
}
