// Mirrors apps/backend/src/modules/programs/entities/program.entity.ts

export enum ImprovementArea {
  SLEEP = 'Sleep',
  BODY = 'Body',
  FOCUS = 'Focus',
  DISCIPLINE = 'Discipline',
  CONFIDENCE = 'Confidence',
  MIND = 'Mind',
  WEALTH = 'Wealth',
  RELATIONSHIPS = 'Relationships',
  CAREER = 'Career',
  HABITS = 'Habits',
}

export enum SleepHoursTier {
  UNDER_5 = 'under_5h',
  FIVE_TO_SIX = '5-6h',
  SIX_TO_SEVEN = '6-7h',
  SEVEN_TO_EIGHT = '7-8h',
  EIGHT_PLUS = '8h+',
}

export enum WaterLitersTier {
  UNDER_1L = 'under_1L',
  ONE_TO_TWO_L = '1-2L',
  TWO_TO_THREE_L = '2-3L',
  THREE_PLUS_L = '3L+',
}

export enum ExerciseFrequencyTier {
  NEVER = 'never',
  ONE_TO_TWO = '1-2x',
  THREE_PLUS = '3+x',
}

export enum ScreenTimeHoursTier {
  UNDER_2 = 'under_2h',
  TWO_TO_FOUR = '2-4h',
  FOUR_TO_SIX = '4-6h',
  SIX_PLUS = '6h+',
}

export interface OnboardingBaseline {
  sleepHours: SleepHoursTier;
  waterLiters: WaterLitersTier;
  exerciseFrequency: ExerciseFrequencyTier;
  screenTimeHours: ScreenTimeHoursTier;
}
