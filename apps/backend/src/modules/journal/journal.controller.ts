import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { JournalService } from './journal.service';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { UpdateJournalEntryDto } from './dto/update-journal-entry.dto';

@UseGuards(JwtAuthGuard)
@Controller('journal')
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Get()
  findAll(
    @Query('programId') programId: string,
    @Request() req: { user: User },
  ) {
    return this.journalService.findAllForProgram(programId, req.user.id);
  }

  @Post()
  create(
    @Query('programId') programId: string,
    @Body() dto: CreateJournalEntryDto,
    @Request() req: { user: User },
  ) {
    return this.journalService.create(programId, req.user.id, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateJournalEntryDto,
    @Request() req: { user: User },
  ) {
    return this.journalService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: { user: User }) {
    return this.journalService.remove(id, req.user.id);
  }
}
