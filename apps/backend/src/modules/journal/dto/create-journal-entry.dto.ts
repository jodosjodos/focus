import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { JournalMood } from '../entities/journal-entry.entity';

export class CreateJournalEntryDto {
  @IsEnum(JournalMood)
  mood: JournalMood;

  @IsString()
  @MinLength(1)
  text: string;

  @IsOptional()
  @IsString()
  photoUri?: string;
}
