import { QuestCategory } from '../../quests/entities/quest-template.entity';

export interface VideoLinkSeed {
  title: string;
  url: string;
  category: QuestCategory;
  channel: string | null;
  estimatedMinutes: number | null;
}

// Real, currently-live URLs found via web search (not fabricated) — a Phase 1
// starter set. Full curation across more categories is Phase 5, per
// docs/FOCUS-development-plan.md.
export const VIDEO_LINKS_SEED: VideoLinkSeed[] = [
  {
    title: 'How To Barbell Squat Correctly (Beginner Tutorial)',
    url: 'https://www.youtube.com/watch?v=f-KL4VNN96E',
    category: QuestCategory.STRENGTH,
    channel: null,
    estimatedMinutes: 10,
  },
  {
    title: 'The Official Squat Form Checklist [Are You Squatting Wrong?]',
    url: 'https://www.youtube.com/watch?v=Uv_DKDl7EjA',
    category: QuestCategory.STRENGTH,
    channel: null,
    estimatedMinutes: 8,
  },
  {
    title: '7 Steps to Build Discipline',
    url: 'https://www.youtube.com/watch?v=_aIApAwAaWY',
    category: QuestCategory.DISCIPLINE,
    channel: null,
    estimatedMinutes: 12,
  },
  {
    title: 'Atomic Habits Summary & Review (James Clear) - ANIMATED',
    url: 'https://www.youtube.com/watch?v=btp-sbwb7zM',
    category: QuestCategory.DISCIPLINE,
    channel: null,
    estimatedMinutes: 10,
  },
  {
    title: "Beginner's Guide To Budgeting | Step By Step Tutorial!",
    url: 'https://www.youtube.com/watch?v=M7ucIl9MGs0',
    category: QuestCategory.DISCIPLINE,
    channel: null,
    estimatedMinutes: 15,
  },
  {
    title: 'Deep Work: How to Focus and Resist Distractions (with Cal Newport)',
    url: 'https://www.youtube.com/watch?v=IZpczNS-ky0',
    category: QuestCategory.FOCUS,
    channel: null,
    estimatedMinutes: 20,
  },
  {
    title: '10 Minute Guided Meditation for Focus',
    url: 'https://www.youtube.com/watch?v=ausxoXBrmWs',
    category: QuestCategory.FOCUS,
    channel: null,
    estimatedMinutes: 10,
  },
  {
    title:
      '10 Minute Guided Meditation for Focused Attention and Concentration (No Music, Voice Only)',
    url: 'https://www.youtube.com/watch?v=vBO8QEjANjs',
    category: QuestCategory.FOCUS,
    channel: null,
    estimatedMinutes: 10,
  },
  {
    title: 'Why You Should Read Books - The Benefits of Reading More (animated)',
    url: 'https://www.youtube.com/watch?v=pRTWFqhEDeo',
    category: QuestCategory.WISDOM,
    channel: null,
    estimatedMinutes: 8,
  },
  {
    title: 'Building atomic habits with James Clear | ReThinking with Adam Grant',
    url: 'https://www.youtube.com/watch?v=M7kFkagIu1Q',
    category: QuestCategory.WISDOM,
    channel: 'ReThinking with Adam Grant',
    estimatedMinutes: 35,
  },
  {
    title: 'Your body language may shape who you are | Amy Cuddy',
    url: 'https://www.youtube.com/watch?v=Ks-_Mh1QhMc',
    category: QuestCategory.CONFIDENCE,
    channel: 'TED',
    estimatedMinutes: 21,
  },
  {
    title: 'Amy Cuddy - More confidence in 2 minutes (Condensed Talk)',
    url: 'https://www.youtube.com/watch?v=r7dWsJ-mEyI',
    category: QuestCategory.CONFIDENCE,
    channel: null,
    estimatedMinutes: 3,
  },
];
