import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestTemplate } from './entities/quest-template.entity';
import { Quest } from './entities/quest.entity';
import { Program } from '../programs/entities/program.entity';
import { QuestsController } from './quests.controller';
import { QuestCompletionController } from './quest-completion.controller';
import { QuestsService } from './quests.service';
import { PlanGenerationService } from './plan-generation.service';
import { QuestCompletionService } from './quest-completion.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuestTemplate, Quest, Program])],
  controllers: [QuestsController, QuestCompletionController],
  providers: [QuestsService, PlanGenerationService, QuestCompletionService],
  exports: [QuestsService, PlanGenerationService],
})
export class QuestsModule {}
