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
import { ReadingEntry } from './reading-entry.entity';

// Per-user "read" record, independent of any quest link — lets a user browse
// ahead in the library without gaming the reward loop (browsing an entry not
// tied to today's quest never awards XP, quest-linked or not, see
// ReadingService.completeEntry), while still persisting "already read" state
// across app restarts.
@Entity('reading_completions')
@Index(['userId', 'readingEntryId'], { unique: true })
export class ReadingCompletion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  readingEntryId: string;

  @ManyToOne(() => ReadingEntry)
  @JoinColumn({ name: 'readingEntryId' })
  readingEntry: ReadingEntry;

  @CreateDateColumn()
  completedAt: Date;
}
