import type { ReadingRecord, IntentionTag } from '@/types/reading';

/** Returns the date string truncated to YYYY-MM-DD */
function toDay(iso: string): string {
  return iso.slice(0, 10);
}

/** Number of consecutive days (ending today) with at least one reading */
export function computeStreak(readings: ReadingRecord[]): number {
  if (readings.length === 0) return 0;

  const days = new Set(readings.map((r) => toDay(r.date)));
  const today = toDay(new Date().toISOString());

  let streak = 0;
  const cursor = new Date(today);

  while (true) {
    const dayStr = toDay(cursor.toISOString());
    if (!days.has(dayStr)) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

/** Most frequently drawn card id across all readings */
export function topCard(readings: ReadingRecord[]): number | null {
  const counts = new Map<number, number>();
  for (const r of readings) {
    for (const c of r.cards) {
      counts.set(c.cardId, (counts.get(c.cardId) ?? 0) + 1);
    }
  }
  if (counts.size === 0) return null;
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

/** Most frequently drawn card id for readings with a specific intention tag */
export function topCardByTag(readings: ReadingRecord[], tag: IntentionTag): number | null {
  const filtered = readings.filter((r) => r.intention?.tag === tag);
  return topCard(filtered);
}

/** Percentage of cards drawn reversed (0–100, integer) */
export function reversalRate(readings: ReadingRecord[]): number {
  const all = readings.flatMap((r) => r.cards);
  if (all.length === 0) return 0;
  const reversed = all.filter((c) => c.isReversed).length;
  return Math.round((reversed / all.length) * 100);
}

/** How many days ago a specific card last appeared (0 = today), null if never */
export function lastSeenDaysAgo(readings: ReadingRecord[], cardId: number): number | null {
  const record = readings
    .filter((r) => r.cards.some((c) => c.cardId === cardId))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  if (!record) return null;

  const last = new Date(record.date);
  const now = new Date();
  const diffMs = now.getTime() - last.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}
