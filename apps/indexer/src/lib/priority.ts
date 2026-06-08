const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

export interface PriorityInput {
  downloads: number;
  views: number;
  likes: number;
  downloadsRecent: number;
  viewsRecent: number;
  externalUpdatedAt: Date | null;
}

export function computePriorityScore(input: PriorityInput): number {
  const daysSinceUpdate = input.externalUpdatedAt
    ? (Date.now() - input.externalUpdatedAt.getTime()) / DAY
    : 999;
  const updatedRecently = daysSinceUpdate < 7 ? 10 : daysSinceUpdate < 30 ? 3 : 0;

  return (
    input.downloadsRecent * 5 +
    input.viewsRecent * 2 +
    input.likes +
    updatedRecently
  );
}

/** Next sync time based on popularity tier. */
export function computeNextSyncAt(score: number, from = new Date()): Date {
  let intervalMs: number;
  if (score >= 100) intervalMs = HOUR;
  else if (score >= 20) intervalMs = DAY;
  else intervalMs = WEEK;

  return new Date(from.getTime() + intervalMs);
}

export function syncPriorityFromScore(score: number): number {
  return Math.min(100, Math.max(1, Math.round(score)));
}

/** Monday=0 … Sunday=6 — category rotation slot for weekly partial sync. */
export function weeklyCategorySlot(date = new Date()): number {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
}
