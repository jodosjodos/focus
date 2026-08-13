import { Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { VideoQuestsService } from './video-quests.service';

@UseGuards(JwtAuthGuard)
@Controller('video-quests')
export class VideoQuestsController {
  constructor(private readonly videoQuestsService: VideoQuestsService) {}

  @Get()
  findAll(
    @Query('programId') programId: string | undefined,
    @Request() req: { user: User },
  ) {
    return this.videoQuestsService.listWithStatus(req.user.id, programId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videoQuestsService.findByIdOrThrow(id);
  }

  @Post(':id/complete')
  complete(
    @Param('id') id: string,
    @Query('programId') programId: string | undefined,
    @Request() req: { user: User },
  ) {
    return this.videoQuestsService.completeEntry(id, req.user.id, programId);
  }
}
