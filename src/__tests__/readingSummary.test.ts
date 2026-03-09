import { describe, it, expect } from 'vitest';
import { generateReadingSummary } from '@/utils/readingSummary';
import { tarotCards } from '@/data/tarotCards';
import type { DrawnCard } from '@/types/tarot';

function makeCard(id: number, isReversed = false): DrawnCard {
  return { card: tarotCards[id], isReversed };
}

describe('generateReadingSummary — smoke tests', () => {
  it('returns null for single spread', () => {
    const result = generateReadingSummary([makeCard(0)], 'single', ['Present'], ['現在']);
    expect(result).toBeNull();
  });

  it('returns a summary for threeCard spread', () => {
    const cards = [makeCard(0), makeCard(1), makeCard(2)];
    const result = generateReadingSummary(cards, 'threeCard', ['Past', 'Present', 'Future'], ['過去', '現在', '未來']);
    expect(result).not.toBeNull();
    expect(result!.summary.length).toBeGreaterThan(50);
    expect(result!.summaryZh.length).toBeGreaterThan(50);
  });

  it('returns a summary for love spread', () => {
    const cards = [makeCard(6), makeCard(3), makeCard(2), makeCard(15), makeCard(17)];
    const result = generateReadingSummary(cards, 'love', ['You', 'Partner', 'Connection', 'Challenge', 'Outcome'], ['你', '對方', '連結', '挑戰', '結果']);
    expect(result).not.toBeNull();
  });

  it('returns a summary for celticCross spread', () => {
    const cards = Array.from({ length: 10 }, (_, i) => makeCard(i));
    const result = generateReadingSummary(cards, 'celticCross',
      ['Present', 'Challenge', 'Past', 'Future', 'Above', 'Below', 'Advice', 'External', 'Hopes/Fears', 'Outcome'],
      ['現在', '挑戰', '過去', '未來', '目標', '潛意識', '建議', '外在影響', '希望/恐懼', '結果']
    );
    expect(result).not.toBeNull();
  });
});
