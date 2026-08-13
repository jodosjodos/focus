import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoLink } from './entities/video-link.entity';
import { VideoCompletion } from './entities/video-completion.entity';
import { Quest } from '../quests/entities/quest.entity';
import { QuestTemplate } from '../quests/entities/quest-template.entity';
import { Program } from '../programs/entities/program.entity';
import { VideoQuestsService } from './video-quests.service';
import { VideoQuestsController } from './video-quests.controller';
import { QuestsModule } from '../quests/quests.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VideoLink, VideoCompletion, Quest, QuestTemplate, Program]),
    QuestsModule,
  ],
  controllers: [VideoQuestsController],
  providers: [VideoQuestsService],
  exports: [VideoQuestsService],
})
export class VideoQuestsModule {}
