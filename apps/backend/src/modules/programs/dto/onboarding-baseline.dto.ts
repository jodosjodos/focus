import { IsEnum } from 'class-validator';
import {
  ExerciseFrequencyTier,
  ScreenTimeHoursTier,
  SleepHoursTier,
  WaterLitersTier,
} from '../entities/program.entity';

export class OnboardingBaselineDto {
  @IsEnum(SleepHoursTier)
  sleepHours: SleepHoursTier;

  @IsEnum(WaterLitersTier)
  waterLiters: WaterLitersTier;

  @IsEnum(ExerciseFrequencyTier)
  exerciseFrequency: ExerciseFrequencyTier;

  @IsEnum(ScreenTimeHoursTier)
  screenTimeHours: ScreenTimeHoursTier;
}
