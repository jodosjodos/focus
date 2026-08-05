import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ImprovementArea } from '../../programs/entities/program.entity';

export enum MotivationCardRarity {
  COMMON = 'common',
  RARE = 'rare',
  MASTER_RARE = 'master_rare',
  X_RARE = 'x_rare',
}

@Entity('motivation_cards')
export class MotivationCard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  quoteText: string;

  @Column({ type: 'enum', enum: MotivationCardRarity })
  rarity: MotivationCardRarity;

  // Matches Program.improvementAreas values exactly, for direct weighted
  // intersection matching against the user's chosen areas.
  @Column({ type: 'jsonb' })
  tags: ImprovementArea[];

  @CreateDateColumn()
  createdAt: Date;
}
