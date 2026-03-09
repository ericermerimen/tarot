import { describe, it, expect } from 'vitest';
import { generateReadingSummary, detectTheme, detectPatterns, detectIconicPair, buildClosingGuidance } from '@/utils/readingSummary';
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

describe('detectPatterns', () => {
  it('returns reversalRatio of 0 when no cards reversed', () => {
    const cards = [makeCard(0, false), makeCard(1, false), makeCard(2, false)];
    expect(detectPatterns(cards).reversalRatio).toBe(0);
  });

  it('returns reversalRatio of 1 when all cards reversed', () => {
    const cards = [makeCard(0, true), makeCard(1, true), makeCard(2, true)];
    expect(detectPatterns(cards).reversalRatio).toBe(1);
  });

  it('returns correct ratio for mixed reversals', () => {
    const cards = [makeCard(0, true), makeCard(1, false), makeCard(2, true), makeCard(3, false)];
    expect(detectPatterns(cards).reversalRatio).toBe(0.5);
  });

  it('returns patternNote null when reversalRatio is ordinary (between 0 and 0.5 exclusive)', () => {
    const cards = [makeCard(0, true), makeCard(1), makeCard(2), makeCard(3), makeCard(4)];
    expect(detectPatterns(cards).patternNote).toBeNull();
  });

  it('returns patternNote for all-upright reading', () => {
    const cards = [makeCard(0), makeCard(1), makeCard(2)];
    const note = detectPatterns(cards).patternNote;
    expect(note).not.toBeNull();
    expect(note!.en).toContain('upright');
    expect(note!.zh.length).toBeGreaterThan(0);
  });

  it('returns patternNote for majority-reversed reading (>=50%)', () => {
    const cards = [makeCard(0, true), makeCard(1, true), makeCard(2, true), makeCard(3, false)];
    const note = detectPatterns(cards).patternNote;
    expect(note).not.toBeNull();
    expect(note!.en.toLowerCase()).toContain('inward');
  });
});

describe('detectIconicPair', () => {
  it('returns insight for Tower + Star pair', () => {
    const result = detectIconicPair(makeCard(16), makeCard(17));
    expect(result).not.toBeNull();
    expect(result!.en).toContain('breaks open');
    expect(result!.zh.length).toBeGreaterThan(0);
  });

  it('returns the same insight regardless of card order', () => {
    const ab = detectIconicPair(makeCard(16), makeCard(17));
    const ba = detectIconicPair(makeCard(17), makeCard(16));
    expect(ab).toEqual(ba);
  });

  it('returns null for non-iconic pair', () => {
    const result = detectIconicPair(makeCard(0), makeCard(4));
    expect(result).toBeNull();
  });

  it('returns insight for Devil + Lovers pair', () => {
    const result = detectIconicPair(makeCard(15), makeCard(6));
    expect(result).not.toBeNull();
    expect(result!.en.toLowerCase()).toContain('release');
  });

  it('returns insight for Death + World pair', () => {
    const result = detectIconicPair(makeCard(13), makeCard(21));
    expect(result).not.toBeNull();
  });
});

describe('buildClosingGuidance', () => {
  it('returns bilingual closing for transformation theme', () => {
    const result = buildClosingGuidance(makeCard(17), 'transformation'); // The Star
    expect(result.en).toContain('The Star');
    expect(result.en.toLowerCase()).toContain('release');
    expect(result.zh).toContain('星星');
  });

  it('returns bilingual closing for achievement theme', () => {
    const result = buildClosingGuidance(makeCard(21), 'achievement'); // The World
    expect(result.en).toContain('The World');
    expect(result.zh.length).toBeGreaterThan(0);
  });

  it('works for a reversed outcome card', () => {
    const result = buildClosingGuidance(makeCard(16, true), 'struggle'); // Tower reversed
    expect(result.en).toContain('The Tower (Reversed)');
    expect(result.zh).toContain('逆位');
  });
});
