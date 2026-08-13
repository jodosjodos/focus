import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestTemplate } from './entities/quest-template.entity';
import { Quest } from './entities/quest.entity';
import { WeeklyQuest } from './entities/weekly-quest.entity';
import { Program } from '../programs/entities/program.entity';
import { QuestsController } from './quests.controller';
import { QuestCompletionController } from './quest-completion.controller';
import { QuestsService } from './quests.service';
import { PlanGenerationService } from './plan-generation.service';
import { QuestCompletionService } from './quest-completion.service';
import { WeeklyQuestService } from './weekly-quest.service';
import { AchievementsModule } from '../achievements/achievements.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuestTemplate, Quest, WeeklyQuest, Program]),
    AchievementsModule,
  ],
  controllers: [QuestsController, QuestCompletionController],
  providers: [QuestsService, PlanGenerationService, QuestCompletionService, WeeklyQuestService],
  exports: [QuestsService, PlanGenerationService, WeeklyQuestService, QuestCompletionService],
})
export class QuestsModule {}
