import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ImprovementArea } from '../entities/program.entity';
import { OnboardingBaselineDto } from './onboarding-baseline.dto';
import { QuestSelectionDto } from './quest-selection.dto';

export class CreateProgramDto {
  @ArrayMinSize(3)
  @ArrayMaxSize(5)
  @IsEnum(ImprovementArea, { each: true })
  improvementAreas: ImprovementArea[];

  @ValidateNested()
  @Type(() => OnboardingBaselineDto)
  baseline: OnboardingBaselineDto;

  @IsInt()
  @Min(21)
  @Max(66)
  lengthDays: number;

  @IsOptional()
  @IsString()
  notWorkingText?: string;

  @IsString()
  timezone: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestSelectionDto)
  quests: QuestSelectionDto[];
}
