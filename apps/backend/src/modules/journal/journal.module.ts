import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JournalEntry } from './entities/journal-entry.entity';
import { Program } from '../programs/entities/program.entity';
import { JournalController } from './journal.controller';
import { JournalService } from './journal.service';

@Module({
  imports: [TypeOrmModule.forFeature([JournalEntry, Program])],
  controllers: [JournalController],
  providers: [JournalService],
})
export class JournalModule {}
