// Mirrors apps/backend/src/modules/reading/entities/reading-entry.entity.ts
import { QuestCategory } from './quest';

export interface ReadingEntry {
  id: string;
  title: string;
  author: string | null;
  category: QuestCategory;
  content: string;
  isOriginal: boolean;
  estimatedMinutes: number;
}

export interface ReadingLibraryItem extends ReadingEntry {
  assigned: boolean;
  completed: boolean;
}

export interface ReadingCompleteResponse {
  entry: ReadingEntry;
  xpAwarded: number;
}
