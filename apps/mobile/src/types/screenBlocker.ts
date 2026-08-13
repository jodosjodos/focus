export enum BlockerMode {
  REMINDER = 'reminder',
  BLOCK = 'block',
}

export enum ShieldAuthorizationStatus {
  APPROVED = 'approved',
  DENIED = 'denied',
  /** Real device, module present, permission simply hasn't been asked for yet. */
  NOT_DETERMINED = 'notDetermined',
  /** Native module isn't linked (Simulator, pre-prebuild) or the entitlement isn't
   * present on this build — distinct from the user denying a real prompt. */
  UNAVAILABLE = 'unavailable',
}

export const DURATION_OPTIONS_MIN = [15, 30, 60, 90] as const;
export type DurationMinutes = (typeof DURATION_OPTIONS_MIN)[number];

export interface ActiveBlockerSession {
  mode: BlockerMode;
  durationMinutes: number;
  startedAt: string;
  endsAt: string;
  selectionToken: string | null;
  notificationIds: { startId: string | null; endId: string | null };
  xpAwarded: boolean;
}
