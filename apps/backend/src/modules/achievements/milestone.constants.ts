// project-description §5.4 — full-screen celebration checkpoints, scaled
// proportionally for programs shorter than the reference 66 days.
export const MILESTONE_CHECKPOINTS = [3, 7, 14, 21, 33, 50, 66];

export function computeScaledMilestoneDays(lengthDays: number): number[] {
  return MILESTONE_CHECKPOINTS.map((c) => Math.round((c / 66) * lengthDays));
}
