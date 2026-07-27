import { User } from '../modules/users/entities/user.entity';
import { Program } from '../modules/programs/entities/program.entity';
import { QuestTemplate } from '../modules/quests/entities/quest-template.entity';
import { Quest } from '../modules/quests/entities/quest.entity';

export const typeOrmEntities = [User, Program, QuestTemplate, Quest];
export const typeOrmMigrationsGlob = [
  __dirname + '/../migrations/*{.ts,.js}',
];
