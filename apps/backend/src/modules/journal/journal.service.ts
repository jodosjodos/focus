import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JournalEntry } from './entities/journal-entry.entity';
import { Program } from '../programs/entities/program.entity';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { UpdateJournalEntryDto } from './dto/update-journal-entry.dto';

@Injectable()
export class JournalService {
  constructor(
    @InjectRepository(JournalEntry)
    private readonly journalRepository: Repository<JournalEntry>,
    @InjectRepository(Program)
    private readonly programsRepository: Repository<Program>,
  ) {}

  async findAllForProgram(programId: string, userId: string): Promise<JournalEntry[]> {
    await this.getOwnedProgramOrThrow(programId, userId);
    return this.journalRepository.find({
      where: { programId },
      order: { createdAt: 'DESC' },
    });
  }

  async create(
    programId: string,
    userId: string,
    dto: CreateJournalEntryDto,
  ): Promise<JournalEntry> {
    const program = await this.getOwnedProgramOrThrow(programId, userId);
    const entry = this.journalRepository.create({
      programId,
      dayNumber: program.currentDay,
      mood: dto.mood,
      text: dto.text,
      photoUri: dto.photoUri ?? null,
    });
    return this.journalRepository.save(entry);
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateJournalEntryDto,
  ): Promise<JournalEntry> {
    const entry = await this.getOwnedEntryOrThrow(id, userId);
    if (dto.mood !== undefined) entry.mood = dto.mood;
    if (dto.text !== undefined) entry.text = dto.text;
    if (dto.photoUri !== undefined) entry.photoUri = dto.photoUri;
    return this.journalRepository.save(entry);
  }

  async remove(id: string, userId: string): Promise<void> {
    const entry = await this.getOwnedEntryOrThrow(id, userId);
    await this.journalRepository.remove(entry);
  }

  private async getOwnedProgramOrThrow(
    programId: string,
    userId: string,
  ): Promise<Program> {
    const program = await this.programsRepository.findOne({ where: { id: programId } });
    if (!program) {
      throw new NotFoundException('Program not found');
    }
    if (program.userId !== userId) {
      throw new ForbiddenException("Cannot access another user's program");
    }
    return program;
  }

  private async getOwnedEntryOrThrow(id: string, userId: string): Promise<JournalEntry> {
    const entry = await this.journalRepository.findOne({ where: { id } });
    if (!entry) {
      throw new NotFoundException('JournalEntry not found');
    }
    await this.getOwnedProgramOrThrow(entry.programId, userId);
    return entry;
  }
}
