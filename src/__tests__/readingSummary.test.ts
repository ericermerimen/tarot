import { describe, it, expect } from 'vitest';
import { generateReadingSummary } from '@/utils/readingSummary';
import { tarotCards } from '@/data/tarotCards';
import type { DrawnCard } from '@/types/tarot';

function makeCard(id: number, isReversed = false): DrawnCard {
  return { card: tarotCards[id], isReversed };
}

describe('generateReadingSummary — smoke tests', () => {
  it('returns null for single spread', () => {
    const result = generateReadingSummary([makeCard(0)], 'single');
    expect(result).toBeNull();
  });

  it('returns a summary for threeCard spread', () => {
    const cards = [makeCard(0), makeCard(1), makeCard(2)];
    const result = generateReadingSummary(cards, 'threeCard');
    expect(result).not.toBeNull();
    expect(result!.summary.length).toBeGreaterThan(50);
    expect(result!.summaryZh.length).toBeGreaterThan(50);
  });

  it('returns a summary for love spread', () => {
    const cards = [makeCard(6), makeCard(3), makeCard(2), makeCard(15), makeCard(17)];
    const result = generateReadingSummary(cards, 'love');
    expect(result).not.toBeNull();
  });

  it('returns a summary for celticCross spread', () => {
    const cards = Array.from({ length: 10 }, (_, i) => makeCard(i));
    const result = generateReadingSummary(cards, 'celticCross');
    expect(result).not.toBeNull();
  });
});
