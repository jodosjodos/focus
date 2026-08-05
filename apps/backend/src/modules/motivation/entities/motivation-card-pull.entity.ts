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
import { Program } from '../../programs/entities/program.entity';
import { MotivationCard, MotivationCardRarity } from './motivation-card.entity';

@Entity('motivation_card_pulls')
@Index(['userId', 'pulledForDate'], { unique: true })
export class MotivationCardPull {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  motivationCardId: string;

  @ManyToOne(() => MotivationCard)
  @JoinColumn({ name: 'motivationCardId' })
  motivationCard: MotivationCard;

  @Column({ nullable: true })
  programId: string | null;

  @ManyToOne(() => Program)
  @JoinColumn({ name: 'programId' })
  program: Program | null;

  // 4am-rollover logical date key (same semantics as ProgramsService's
  // computeRawDay) — the "one pull per day" uniqueness key.
  @Column({ type: 'date' })
  pulledForDate: string;

  // Denormalized at pull time so it survives even if MotivationCard content
  // is edited/reseeded later.
  @Column({ type: 'enum', enum: MotivationCardRarity })
  rarity: MotivationCardRarity;

  @Column()
  serial: string;

  @Column({ type: 'timestamptz', nullable: true })
  acknowledgedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
