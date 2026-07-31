import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoLink } from './entities/video-link.entity';
import { VideoQuestsService } from './video-quests.service';

@Module({
  imports: [TypeOrmModule.forFeature([VideoLink])],
  providers: [VideoQuestsService],
  exports: [VideoQuestsService],
})
export class VideoQuestsModule {}
