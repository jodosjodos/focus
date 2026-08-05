import { AchievementType } from '../entities/achievement.entity';

export interface AchievementSeed {
  key: string;
  type: AchievementType;
  milestoneCheckpointIndex: number | null;
  hiddenRuleKey: string | null;
  title: string;
  quoteOrDescription: string;
  unlockConditionText: string;
  iconKey: string;
  colorKey: string;
}

// Hex values mirror apps/mobile/src/theme/colors.ts — kept as plain strings
// here since the backend doesn't import the mobile theme module.
const COLOR = {
  primary: '#3B82F6',
  success: '#34D399',
  strength: '#F87171',
  discipline: '#8FA2C9',
  focus: '#60A5FA',
  wisdom: '#818CF8',
  confidence: '#FBBF24',
};

export const ACHIEVEMENTS_SEED: AchievementSeed[] = [
  // Milestones — project-description §5.4, checkpointIndex matches
  // MILESTONE_CHECKPOINTS' position (3/7/14/21/33/50/66).
  {
    key: 'milestone_day_3',
    type: AchievementType.MILESTONE,
    milestoneCheckpointIndex: 0,
    hiddenRuleKey: null,
    title: 'First Steps',
    quoteOrDescription:
      "Three days in. The version of you that almost didn't start is already behind you.",
    unlockConditionText: 'Reach Day 3.',
    iconKey: 'footsteps-outline',
    colorKey: COLOR.primary,
  },
  {
    key: 'milestone_day_7',
    type: AchievementType.MILESTONE,
    milestoneCheckpointIndex: 1,
    hiddenRuleKey: null,
    title: 'One Week Strong',
    quoteOrDescription: 'A full week. Not luck — repetition.',
    unlockConditionText: 'Reach Day 7.',
    iconKey: 'flame-outline',
    colorKey: COLOR.primary,
  },
  {
    key: 'milestone_day_14',
    type: AchievementType.MILESTONE,
    milestoneCheckpointIndex: 2,
    hiddenRuleKey: null,
    title: 'Two Weeks Deep',
    quoteOrDescription:
      'Two weeks of showing up. This is what becoming someone new actually looks like — quiet, daily, unglamorous.',
    unlockConditionText: 'Reach Day 14.',
    iconKey: 'layers-outline',
    colorKey: COLOR.discipline,
  },
  {
    key: 'milestone_day_21',
    type: AchievementType.MILESTONE,
    milestoneCheckpointIndex: 3,
    hiddenRuleKey: null,
    title: 'Habit Line',
    quoteOrDescription:
      "Twenty-one days. Whatever you thought this had to feel like by now — it feels like this: normal.",
    unlockConditionText: 'Reach Day 21.',
    iconKey: 'infinite-outline',
    colorKey: COLOR.focus,
  },
  {
    key: 'milestone_day_33',
    type: AchievementType.MILESTONE,
    milestoneCheckpointIndex: 4,
    hiddenRuleKey: null,
    title: 'Past Halfway',
    quoteOrDescription: "Halfway used to be the hard part. You're past it, still moving.",
    unlockConditionText: 'Reach the halfway point.',
    iconKey: 'trending-up-outline',
    colorKey: COLOR.confidence,
  },
  {
    key: 'milestone_day_50',
    type: AchievementType.MILESTONE,
    milestoneCheckpointIndex: 5,
    hiddenRuleKey: null,
    title: 'Fifty',
    quoteOrDescription:
      "Fifty days of a decision you keep making. That's not motivation. That's who you are now.",
    unlockConditionText: 'Reach Day 50.',
    iconKey: 'star-outline',
    colorKey: COLOR.wisdom,
  },
  {
    key: 'milestone_day_66',
    type: AchievementType.MILESTONE,
    milestoneCheckpointIndex: 6,
    hiddenRuleKey: null,
    title: 'Sixty-Six',
    quoteOrDescription:
      'Sixty-six days ago you were guessing if this would stick. It stuck. Look at what you built.',
    unlockConditionText: 'Complete the full program.',
    iconKey: 'trophy-outline',
    colorKey: COLOR.success,
  },

  // Hidden / quirky — condition text stays hidden client-side until unlocked
  // (see AchievementsService.getGrid).
  {
    key: 'hidden_early_bird',
    type: AchievementType.HIDDEN,
    milestoneCheckpointIndex: null,
    hiddenRuleKey: 'hidden_early_bird',
    title: 'Early Riser',
    quoteOrDescription: 'The morning already knows who you are before the world wakes up.',
    unlockConditionText: 'Complete every quest before 8am, on 3 different days.',
    iconKey: 'sunny-outline',
    colorKey: COLOR.focus,
  },
  {
    key: 'hidden_perfect_week',
    type: AchievementType.HIDDEN,
    milestoneCheckpointIndex: null,
    hiddenRuleKey: 'hidden_perfect_week',
    title: 'Perfect Week',
    quoteOrDescription: 'Seven days, nothing skipped. That is not an accident.',
    unlockConditionText: '7 straight program days with zero skipped quests.',
    iconKey: 'checkmark-done-outline',
    colorKey: COLOR.success,
  },
  {
    key: 'hidden_comeback',
    type: AchievementType.HIDDEN,
    milestoneCheckpointIndex: null,
    hiddenRuleKey: 'hidden_comeback',
    title: 'Comeback',
    quoteOrDescription: "Falling off isn't the story. Getting back on is.",
    unlockConditionText: 'Restore a skipped quest and finish it — 3 times.',
    iconKey: 'refresh-outline',
    colorKey: COLOR.primary,
  },
  {
    key: 'hidden_night_owl',
    type: AchievementType.HIDDEN,
    milestoneCheckpointIndex: null,
    hiddenRuleKey: 'hidden_night_owl',
    title: 'Night Owl',
    quoteOrDescription: 'The day was over. You weren’t.',
    unlockConditionText: 'Complete a quest after 11pm, 5 times.',
    iconKey: 'moon-outline',
    colorKey: COLOR.wisdom,
  },
  {
    key: 'hidden_jack_of_all',
    type: AchievementType.HIDDEN,
    milestoneCheckpointIndex: null,
    hiddenRuleKey: 'hidden_jack_of_all',
    title: 'Full Spectrum',
    quoteOrDescription: 'Body, mind, discipline, focus, confidence — all in one day.',
    unlockConditionText: 'Touch all 5 stats in a single day.',
    iconKey: 'color-palette-outline',
    colorKey: COLOR.confidence,
  },
  {
    key: 'hidden_no_days_off',
    type: AchievementType.HIDDEN,
    milestoneCheckpointIndex: null,
    hiddenRuleKey: 'hidden_no_days_off',
    title: 'No Days Off',
    quoteOrDescription: 'Thirty days straight. This stopped being willpower a while ago.',
    unlockConditionText: 'Reach a 30-day streak.',
    iconKey: 'shield-checkmark-outline',
    colorKey: COLOR.strength,
  },
  {
    key: 'hidden_renaissance',
    type: AchievementType.HIDDEN,
    milestoneCheckpointIndex: null,
    hiddenRuleKey: 'hidden_renaissance',
    title: 'Renaissance',
    quoteOrDescription: "You didn't just pick a lane. You tried every one.",
    unlockConditionText: 'Complete at least one quest of every type.',
    iconKey: 'school-outline',
    colorKey: COLOR.wisdom,
  },
  {
    key: 'hidden_bounce_back',
    type: AchievementType.HIDDEN,
    milestoneCheckpointIndex: null,
    hiddenRuleKey: 'hidden_bounce_back',
    title: 'Bounce Back',
    quoteOrDescription: 'One thing slipped. Nothing else did.',
    unlockConditionText:
      'Skip something but still clear everything else that day — 3 times.',
    iconKey: 'trending-up-outline',
    colorKey: COLOR.success,
  },
];
