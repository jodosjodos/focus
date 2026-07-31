import { User } from '../modules/users/entities/user.entity';
import { Program } from '../modules/programs/entities/program.entity';
import { QuestTemplate } from '../modules/quests/entities/quest-template.entity';
import { Quest } from '../modules/quests/entities/quest.entity';
import { ReadingEntry } from '../modules/reading/entities/reading-entry.entity';
import { VideoLink } from '../modules/video-quests/entities/video-link.entity';

export const typeOrmEntities = [
  User,
  Program,
  QuestTemplate,
  Quest,
  ReadingEntry,
  VideoLink,
];
export const typeOrmMigrationsGlob = [
  __dirname + '/../migrations/*{.ts,.js}',
];
