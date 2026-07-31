import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { ProgramsService } from './programs.service';
import { PreviewProgramDto } from './dto/preview-program.dto';
import { SwapTemplateDto } from './dto/swap-template.dto';
import { CreateProgramDto } from './dto/create-program.dto';

@Controller('programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  // Stateless — no auth needed. Called before account creation exists.
  @Post('preview')
  preview(@Body() dto: PreviewProgramDto) {
    return this.programsService.preview(dto);
  }

  @Post('preview/swap')
  swap(@Body() dto: SwapTemplateDto) {
    return this.programsService.swapTemplate(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req: { user: User }, @Body() dto: CreateProgramDto) {
    return this.programsService.create(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req: { user: User }) {
    return this.programsService.findAllForUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.programsService.findByIdOrThrow(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/quests/today')
  getTodayQuests(@Param('id') id: string) {
    return this.programsService.getTodayQuests(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/stats')
  getStats(@Param('id') id: string) {
    return this.programsService.getStats(id);
  }
}
