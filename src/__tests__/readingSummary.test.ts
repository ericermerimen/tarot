import { describe, it, expect } from 'vitest';
import { generateReadingSummary, detectTheme } from '@/utils/readingSummary';
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

describe('detectTheme', () => {
  it('detects transformation when change/endings cards dominate', () => {
    // Death (13): transformation, change, transition, endings
    // Wheel of Fortune (10): change, cycles, karma, fate
    // Judgment (20): reflection, reckoning, awakening, absolution
    const cards = [makeCard(13), makeCard(10), makeCard(20)];
    expect(detectTheme(cards)).toBe('transformation');
  });

  it('detects innerJourney when introspective cards dominate', () => {
    // High Priestess (2): intuition, mystery, inner knowledge, subconscious
    // Hermit (9): soul searching, introspection, inner guidance, solitude
    // Moon (18): illusion, fear, the unconscious, confusion
    const cards = [makeCard(2), makeCard(9), makeCard(18)];
    expect(detectTheme(cards)).toBe('innerJourney');
  });

  it('detects achievement when success/mastery cards dominate', () => {
    // Magician (1): manifestation, willpower, skill, concentration
    // Chariot (7): control, willpower, success, determination
    // Sun (19): positivity, success, vitality, joy
    const cards = [makeCard(1), makeCard(7), makeCard(19)];
    expect(detectTheme(cards)).toBe('achievement');
  });

  it('detects loveConnection when love/relationship cards dominate', () => {
    // Lovers (6): love, harmony, relationships, values
    // Empress (3): abundance, fertility, nurturing, nature
    const cards = [makeCard(6), makeCard(3), makeCard(6)];
    expect(detectTheme(cards)).toBe('loveConnection');
  });

  it('works with a single card', () => {
    const result = detectTheme([makeCard(16)]); // Tower: upheaval, chaos, revelation, disruption
    expect(['transformation', 'struggle']).toContain(result);
  });
});
