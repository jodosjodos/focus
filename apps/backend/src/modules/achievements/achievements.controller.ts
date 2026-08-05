import { Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { AchievementsService } from './achievements.service';

@UseGuards(JwtAuthGuard)
@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Get('grid')
  getGrid(@Request() req: { user: User }) {
    return this.achievementsService.getGrid(req.user.id);
  }

  @Get('unlocks/pending')
  getPendingUnlocks(@Request() req: { user: User }) {
    return this.achievementsService.getPendingUnlocks(req.user.id);
  }

  @Post('unlocks/:id/acknowledge')
  acknowledge(@Param('id') id: string, @Request() req: { user: User }) {
    return this.achievementsService.acknowledge(id, req.user.id);
  }
}
