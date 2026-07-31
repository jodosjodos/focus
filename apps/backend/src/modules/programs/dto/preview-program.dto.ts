import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
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

export class PreviewProgramDto {
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
  programLength: number;

  @IsOptional()
  @IsString()
  notWorkingText?: string;
}
