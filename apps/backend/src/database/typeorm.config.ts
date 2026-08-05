import { User } from '../modules/users/entities/user.entity';
import { Program } from '../modules/programs/entities/program.entity';
import { QuestTemplate } from '../modules/quests/entities/quest-template.entity';
import { Quest } from '../modules/quests/entities/quest.entity';
import { WeeklyQuest } from '../modules/quests/entities/weekly-quest.entity';
import { ReadingEntry } from '../modules/reading/entities/reading-entry.entity';
import { VideoLink } from '../modules/video-quests/entities/video-link.entity';
import { Achievement } from '../modules/achievements/entities/achievement.entity';
import { AchievementUnlock } from '../modules/achievements/entities/achievement-unlock.entity';
import { MotivationCard } from '../modules/motivation/entities/motivation-card.entity';
import { MotivationCardPull } from '../modules/motivation/entities/motivation-card-pull.entity';

export const typeOrmEntities = [
  User,
  Program,
  QuestTemplate,
  Quest,
  WeeklyQuest,
  ReadingEntry,
  VideoLink,
  Achievement,
  AchievementUnlock,
  MotivationCard,
  MotivationCardPull,
];
export const typeOrmMigrationsGlob = [
  __dirname + '/../migrations/*{.ts,.js}',
];
