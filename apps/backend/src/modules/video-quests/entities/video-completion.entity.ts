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
import { VideoLink } from './video-link.entity';

// Per-user "watched" record — mirrors ReadingCompletion. Independent of any
// quest link, so browsing/marking a non-assigned video done never awards XP.
@Entity('video_completions')
@Index(['userId', 'videoLinkId'], { unique: true })
export class VideoCompletion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  videoLinkId: string;

  @ManyToOne(() => VideoLink)
  @JoinColumn({ name: 'videoLinkId' })
  videoLink: VideoLink;

  @CreateDateColumn()
  completedAt: Date;
}
