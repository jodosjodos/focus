import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Program, StatSnapshot } from '../../programs/entities/program.entity';
import { Achievement } from './achievement.entity';

@Entity('achievement_unlocks')
@Index(['userId', 'achievementId'], { unique: true })
export class AchievementUnlock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  achievementId: string;

  @ManyToOne(() => Achievement)
  @JoinColumn({ name: 'achievementId' })
  achievement: Achievement;

  // Context only — unlocks are user-scoped (persist across program
  // restarts), never uniqued on this column.
  @Column({ nullable: true })
  programId: string | null;

  @ManyToOne(() => Program)
  @JoinColumn({ name: 'programId' })
  program: Program | null;

  @CreateDateColumn()
  unlockedAt: Date;

  // Server-side "already shown" tracking — set when the client acknowledges
  // the celebration overlay.
  @Column({ type: 'timestamptz', nullable: true })
  acknowledgedAt: Date | null;

  @Column({ type: 'int', nullable: true })
  dayNumberAtUnlock: number | null;

  // { baseline: StatSnapshot, current: StatSnapshot } frozen at unlock time,
  // for the Milestone Celebration's Day-1-vs-Now comparison.
  @Column({ type: 'jsonb', nullable: true })
  statsSnapshot: { baseline: StatSnapshot; current: StatSnapshot } | null;
}
