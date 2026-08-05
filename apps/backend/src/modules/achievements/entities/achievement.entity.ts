import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum AchievementType {
  MILESTONE = 'milestone',
  HIDDEN = 'hidden',
}

@Entity('achievements')
export class Achievement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  key: string;

  @Column({ type: 'enum', enum: AchievementType })
  type: AchievementType;

  // 0-6 into MILESTONE_CHECKPOINTS — only set for type=milestone.
  @Column({ type: 'int', nullable: true })
  milestoneCheckpointIndex: number | null;

  // Matches HiddenAchievementRule.key — only set for type=hidden.
  @Column({ type: 'varchar', nullable: true, unique: true })
  hiddenRuleKey: string | null;

  @Column()
  title: string;

  @Column({ type: 'text' })
  quoteOrDescription: string;

  @Column()
  unlockConditionText: string;

  // Ionicons glyph name — flat placeholder "art" per the pre-art-pass design
  // system. Real illustrated art is Phase 6's job, not this one.
  @Column()
  iconKey: string;

  // Hex, drawn from apps/mobile/src/theme/colors.ts.
  @Column()
  colorKey: string;

  @CreateDateColumn()
  createdAt: Date;
}
