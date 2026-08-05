import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MotivationCard } from './entities/motivation-card.entity';
import { MotivationCardPull } from './entities/motivation-card-pull.entity';
import { Program } from '../programs/entities/program.entity';
import { MotivationCardsController } from './motivation-cards.controller';
import { MotivationCardsService } from './motivation-cards.service';

@Module({
  imports: [TypeOrmModule.forFeature([MotivationCard, MotivationCardPull, Program])],
  controllers: [MotivationCardsController],
  providers: [MotivationCardsService],
})
export class MotivationModule {}
