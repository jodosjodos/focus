import { Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { MotivationCardsService } from './motivation-cards.service';

@UseGuards(JwtAuthGuard)
@Controller('motivation-cards')
export class MotivationCardsController {
  constructor(private readonly motivationCardsService: MotivationCardsService) {}

  @Get('today')
  today(@Query('programId') programId: string | undefined, @Request() req: { user: User }) {
    return this.motivationCardsService.pullForToday(req.user.id, programId);
  }

  @Post('pulls/:id/acknowledge')
  acknowledge(@Param('id') id: string, @Request() req: { user: User }) {
    return this.motivationCardsService.acknowledge(id, req.user.id);
  }
}
