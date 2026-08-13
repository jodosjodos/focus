// Mirrors apps/backend/src/modules/journal/entities/journal-entry.entity.ts

export enum JournalMood {
  GREAT = 'great',
  GOOD = 'good',
  NEUTRAL = 'neutral',
  LOW = 'low',
  STRONG = 'strong',
}

export const MOOD_EMOJI: Record<JournalMood, string> = {
  [JournalMood.GREAT]: '🚀',
  [JournalMood.GOOD]: '🙂',
  [JournalMood.NEUTRAL]: '😐',
  [JournalMood.LOW]: '😔',
  [JournalMood.STRONG]: '💪',
};

export const MOOD_ORDER: JournalMood[] = [
  JournalMood.GREAT,
  JournalMood.GOOD,
  JournalMood.NEUTRAL,
  JournalMood.LOW,
  JournalMood.STRONG,
];

export interface JournalEntry {
  id: string;
  programId: string;
  dayNumber: number;
  mood: JournalMood;
  text: string;
  photoUri: string | null;
  createdAt: string;
}
