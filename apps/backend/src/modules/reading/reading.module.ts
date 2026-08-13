import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReadingEntry } from './entities/reading-entry.entity';
import { ReadingCompletion } from './entities/reading-completion.entity';
import { Quest } from '../quests/entities/quest.entity';
import { QuestTemplate } from '../quests/entities/quest-template.entity';
import { Program } from '../programs/entities/program.entity';
import { ReadingService } from './reading.service';
import { ReadingController } from './reading.controller';
import { QuestsModule } from '../quests/quests.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReadingEntry, ReadingCompletion, Quest, QuestTemplate, Program]),
    QuestsModule,
  ],
  controllers: [ReadingController],
  providers: [ReadingService],
  exports: [ReadingService],
})
export class ReadingModule {}
