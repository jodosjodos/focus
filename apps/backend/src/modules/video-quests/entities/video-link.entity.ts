import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { QuestCategory } from '../../quests/entities/quest-template.entity';

@Entity('video_links')
export class VideoLink {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  url: string;

  @Column({ type: 'enum', enum: QuestCategory })
  category: QuestCategory;

  @Column({ type: 'varchar', nullable: true })
  channel: string | null;

  @Column({ type: 'int', nullable: true })
  estimatedMinutes: number | null;
}
