import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReadingEntry } from './entities/reading-entry.entity';
import { ReadingService } from './reading.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReadingEntry])],
  providers: [ReadingService],
  exports: [ReadingService],
})
export class ReadingModule {}
