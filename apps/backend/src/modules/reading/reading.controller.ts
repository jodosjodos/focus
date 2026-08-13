import { Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { ReadingService } from './reading.service';

@UseGuards(JwtAuthGuard)
@Controller('reading')
export class ReadingController {
  constructor(private readonly readingService: ReadingService) {}

  @Get()
  findAll(
    @Query('programId') programId: string | undefined,
    @Request() req: { user: User },
  ) {
    return this.readingService.listWithStatus(req.user.id, programId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.readingService.findByIdOrThrow(id);
  }

  @Post(':id/complete')
  complete(
    @Param('id') id: string,
    @Query('programId') programId: string | undefined,
    @Request() req: { user: User },
  ) {
    return this.readingService.completeEntry(id, req.user.id, programId);
  }
}
