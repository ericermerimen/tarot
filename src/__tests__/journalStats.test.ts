import { describe, it, expect } from 'vitest';
import {
  computeStreak,
  topCard,
  topCardByTag,
  reversalRate,
  lastSeenDaysAgo,
} from '@/lib/journalStats';
import type { ReadingRecord } from '@/types/reading';

const today = new Date();
const daysAgo = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

const makeRecord = (
  cardIds: number[],
  date: string,
  tag?: string,
  reversed?: boolean[]
): ReadingRecord => ({
  date,
  spread: 'single',
  cards: cardIds.map((id, i) => ({
    cardId: id,
    isReversed: reversed?.[i] ?? false,
    position: 'Present',
    positionZh: '現在',
  })),
  intention: tag ? { tag: tag as ReadingRecord['intention'] extends { tag: infer T } ? T : never } : undefined,
});

describe('computeStreak', () => {
  it('returns 0 for empty readings', () => {
    expect(computeStreak([])).toBe(0);
  });

  it('returns 1 for a single reading today', () => {
    expect(computeStreak([makeRecord([0], daysAgo(0))])).toBe(1);
  });

  it('counts consecutive days ending today', () => {
    const records = [
      makeRecord([0], daysAgo(0)),
      makeRecord([1], daysAgo(1)),
      makeRecord([2], daysAgo(2)),
    ];
    expect(computeStreak(records)).toBe(3);
  });

  it('stops at a gap', () => {
    const records = [
      makeRecord([0], daysAgo(0)),
      makeRecord([1], daysAgo(2)), // gap at day 1
    ];
    expect(computeStreak(records)).toBe(1);
  });
});

describe('topCard', () => {
  it('returns null for empty readings', () => {
    expect(topCard([])).toBeNull();
  });

  it('returns the most frequent card id', () => {
    const records = [
      makeRecord([0, 1], daysAgo(0)),
      makeRecord([0], daysAgo(1)),
      makeRecord([1], daysAgo(2)),
    ];
    expect(topCard(records)).toBe(0); // card 0 appears twice
  });
});

describe('topCardByTag', () => {
  it('returns null when no records have the given tag', () => {
    expect(topCardByTag([], 'career')).toBeNull();
  });

  it('returns the most frequent card for a given tag', () => {
    const records = [
      makeRecord([3], daysAgo(0), 'career'),
      makeRecord([3], daysAgo(1), 'career'),
      makeRecord([5], daysAgo(2), 'career'),
      makeRecord([5], daysAgo(3), 'love'),
    ];
    expect(topCardByTag(records, 'career')).toBe(3);
  });
});

describe('reversalRate', () => {
  it('returns 0 for empty readings', () => {
    expect(reversalRate([])).toBe(0);
  });

  it('returns correct percentage', () => {
    const records = [
      makeRecord([0], daysAgo(0), undefined, [true]),
      makeRecord([1], daysAgo(1), undefined, [false]),
    ];
    expect(reversalRate(records)).toBe(50);
  });
});

describe('lastSeenDaysAgo', () => {
  it('returns null when card never appeared', () => {
    expect(lastSeenDaysAgo([], 99)).toBeNull();
  });

  it('returns 0 when card appeared today', () => {
    const records = [makeRecord([7], daysAgo(0))];
    expect(lastSeenDaysAgo(records, 7)).toBe(0);
  });

  it('returns correct days since last appearance', () => {
    const records = [
      makeRecord([7], daysAgo(5)),
      makeRecord([2], daysAgo(0)),
    ];
    expect(lastSeenDaysAgo(records, 7)).toBe(5);
  });
});
