import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestTemplate } from './entities/quest-template.entity';
import { Quest } from './entities/quest.entity';
import { QuestsController } from './quests.controller';
import { QuestsService } from './quests.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuestTemplate, Quest])],
  controllers: [QuestsController],
  providers: [QuestsService],
  exports: [QuestsService],
})
export class QuestsModule {}
