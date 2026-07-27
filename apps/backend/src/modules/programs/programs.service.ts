import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Program } from './entities/program.entity';
import { CreateProgramDto } from './dto/create-program.dto';

const ZERO_STATS = {
  discipline: 0,
  focus: 0,
  strength: 0,
  confidence: 0,
  wisdom: 0,
};

@Injectable()
export class ProgramsService {
  constructor(
    @InjectRepository(Program)
    private readonly programsRepository: Repository<Program>,
  ) {}

  create(userId: string, dto: CreateProgramDto): Promise<Program> {
    const program = this.programsRepository.create({
      userId,
      lengthDays: dto.lengthDays,
      startDate: dto.startDate,
      baselineStats: ZERO_STATS,
      currentStats: ZERO_STATS,
    });
    return this.programsRepository.save(program);
  }

  async findByIdOrThrow(id: string): Promise<Program> {
    const program = await this.programsRepository.findOne({ where: { id } });
    if (!program) {
      throw new NotFoundException('Program not found');
    }
    return program;
  }

  findAllForUser(userId: string): Promise<Program[]> {
    return this.programsRepository.find({ where: { userId } });
  }
}
