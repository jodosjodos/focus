// Mirrors apps/backend/src/modules/motivation/entities/*.ts

export enum MotivationCardRarity {
  COMMON = 'common',
  RARE = 'rare',
  MASTER_RARE = 'master_rare',
  X_RARE = 'x_rare',
}

export interface MotivationCardPullResponse {
  id: string;
  quoteText: string;
  rarity: MotivationCardRarity;
  serial: string;
  pulledForDate: string;
  acknowledgedAt: string | null;
}
