import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Program } from '../../programs/entities/program.entity';

export enum JournalMood {
  GREAT = 'great',
  GOOD = 'good',
  NEUTRAL = 'neutral',
  LOW = 'low',
  STRONG = 'strong',
}

@Entity('journal_entries')
export class JournalEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  programId: string;

  @ManyToOne(() => Program)
  @JoinColumn({ name: 'programId' })
  program: Program;

  // Snapshotted from program.currentDay at create time — like Quest.dayNumber,
  // this is not recomputed later so an entry's "Day N" label never drifts.
  @Column({ type: 'int' })
  dayNumber: number;

  @Column({ type: 'enum', enum: JournalMood })
  mood: JournalMood;

  @Column({ type: 'text' })
  text: string;

  // Local device file URI only (Phase 3 decision — no backend photo storage yet).
  @Column({ type: 'varchar', nullable: true })
  photoUri: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
