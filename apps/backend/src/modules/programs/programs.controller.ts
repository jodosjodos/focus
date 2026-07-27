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
import { CreateProgramDto } from './dto/create-program.dto';

@UseGuards(JwtAuthGuard)
@Controller('programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Post()
  create(@Request() req: { user: User }, @Body() dto: CreateProgramDto) {
    return this.programsService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Request() req: { user: User }) {
    return this.programsService.findAllForUser(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.programsService.findByIdOrThrow(id);
  }
}
