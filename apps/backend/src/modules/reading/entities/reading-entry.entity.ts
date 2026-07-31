import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { QuestCategory } from '../../quests/entities/quest-template.entity';

@Entity('reading_entries')
export class ReadingEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'varchar', nullable: true })
  author: string | null;

  @Column({ type: 'enum', enum: QuestCategory })
  category: QuestCategory;

  @Column({ type: 'text' })
  content: string;

  // true = written directly for Focus; false = a verified public-domain excerpt
  @Column({ default: true })
  isOriginal: boolean;

  @Column({ type: 'int' })
  estimatedMinutes: number;
}
