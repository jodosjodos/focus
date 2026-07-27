import { IsDateString, IsInt, Max, Min } from 'class-validator';

export class CreateProgramDto {
  @IsInt()
  @Min(21)
  @Max(66)
  lengthDays: number;

  @IsDateString()
  startDate: string;
}
