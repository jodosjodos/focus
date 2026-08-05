import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from './entities/achievement.entity';
import { AchievementUnlock } from './entities/achievement-unlock.entity';
import { Quest } from '../quests/entities/quest.entity';
import { QuestTemplate } from '../quests/entities/quest-template.entity';
import { Program } from '../programs/entities/program.entity';
import { AchievementsController } from './achievements.controller';
import { AchievementsService } from './achievements.service';
import { MilestoneService } from './milestone.service';
import { HiddenAchievementsService } from './hidden-achievements.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Achievement, AchievementUnlock, Quest, QuestTemplate, Program]),
  ],
  controllers: [AchievementsController],
  providers: [AchievementsService, MilestoneService, HiddenAchievementsService],
  exports: [AchievementsService, MilestoneService, HiddenAchievementsService],
})
export class AchievementsModule {}
