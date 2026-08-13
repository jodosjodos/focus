// Mirrors apps/backend/src/modules/video-quests/entities/video-link.entity.ts
import { QuestCategory } from './quest';

export interface VideoLink {
  id: string;
  title: string;
  url: string;
  category: QuestCategory;
  channel: string | null;
  estimatedMinutes: number | null;
}

export interface VideoLibraryItem extends VideoLink {
  assigned: boolean;
  completed: boolean;
}

export interface VideoCompleteResponse {
  entry: VideoLink;
  xpAwarded: number;
}
