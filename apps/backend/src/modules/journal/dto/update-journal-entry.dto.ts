import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { JournalMood } from '../entities/journal-entry.entity';

export class UpdateJournalEntryDto {
  @IsOptional()
  @IsEnum(JournalMood)
  mood?: JournalMood;

  @IsOptional()
  @IsString()
  @MinLength(1)
  text?: string;

  @IsOptional()
  @IsString()
  photoUri?: string | null;
}
