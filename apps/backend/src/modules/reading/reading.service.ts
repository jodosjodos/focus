import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReadingEntry } from './entities/reading-entry.entity';

@Injectable()
export class ReadingService {
  constructor(
    @InjectRepository(ReadingEntry)
    private readonly readingRepository: Repository<ReadingEntry>,
  ) {}

  async findByIdOrThrow(id: string): Promise<ReadingEntry> {
    const entry = await this.readingRepository.findOne({ where: { id } });
    if (!entry) {
      throw new NotFoundException('ReadingEntry not found');
    }
    return entry;
  }
}
