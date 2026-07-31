import {
  OnboardingBaseline,
  SleepHoursTier,
  WaterLitersTier,
  ExerciseFrequencyTier,
  ScreenTimeHoursTier,
  StatSnapshot,
} from './entities/program.entity';

// project-description §5.1 Baseline Result: base 30, ±0-15 delta per stat,
// final range 30-45. Sleep/screen-time/water feed Discipline; exercise feeds
// Strength. Focus/Wisdom/Confidence have no direct baseline question, so they
// get a flat mid-range delta — see docs/DEFERRED-IMPLEMENTATION.md.
const BASE_STAT = 30;
const FLAT_DELTA = 7;

const SLEEP_SCORE: Record<SleepHoursTier, number> = {
  [SleepHoursTier.UNDER_5]: 0,
  [SleepHoursTier.FIVE_TO_SIX]: 4,
  [SleepHoursTier.SIX_TO_SEVEN]: 8,
  [SleepHoursTier.SEVEN_TO_EIGHT]: 12,
  [SleepHoursTier.EIGHT_PLUS]: 15,
};

const SCREEN_TIME_SCORE: Record<ScreenTimeHoursTier, number> = {
  [ScreenTimeHoursTier.SIX_PLUS]: 0,
  [ScreenTimeHoursTier.FOUR_TO_SIX]: 5,
  [ScreenTimeHoursTier.TWO_TO_FOUR]: 10,
  [ScreenTimeHoursTier.UNDER_2]: 15,
};

const WATER_SCORE: Record<WaterLitersTier, number> = {
  [WaterLitersTier.UNDER_1L]: 0,
  [WaterLitersTier.ONE_TO_TWO_L]: 5,
  [WaterLitersTier.TWO_TO_THREE_L]: 10,
  [WaterLitersTier.THREE_PLUS_L]: 15,
};

const EXERCISE_SCORE: Record<ExerciseFrequencyTier, number> = {
  [ExerciseFrequencyTier.NEVER]: 0,
  [ExerciseFrequencyTier.ONE_TO_TWO]: 8,
  [ExerciseFrequencyTier.THREE_PLUS]: 15,
};

export function computeDay1Rating(baseline: OnboardingBaseline): StatSnapshot {
  const disciplineDelta = Math.round(
    (SLEEP_SCORE[baseline.sleepHours] +
      SCREEN_TIME_SCORE[baseline.screenTimeHours] +
      WATER_SCORE[baseline.waterLiters]) /
      3,
  );
  const strengthDelta = EXERCISE_SCORE[baseline.exerciseFrequency];

  return {
    discipline: BASE_STAT + disciplineDelta,
    strength: BASE_STAT + strengthDelta,
    focus: BASE_STAT + FLAT_DELTA,
    wisdom: BASE_STAT + FLAT_DELTA,
    confidence: BASE_STAT + FLAT_DELTA,
  };
}

// Day-Final "Potential" — flat +20 off baseline, capped at 100. See
// docs/DEFERRED-IMPLEMENTATION.md for why this is a placeholder.
const POTENTIAL_GAIN = 20;

export function computePotentialStats(baseline: StatSnapshot): StatSnapshot {
  const clampAdd = (value: number) => Math.min(100, value + POTENTIAL_GAIN);
  return {
    discipline: clampAdd(baseline.discipline),
    focus: clampAdd(baseline.focus),
    strength: clampAdd(baseline.strength),
    confidence: clampAdd(baseline.confidence),
    wisdom: clampAdd(baseline.wisdom),
  };
}
