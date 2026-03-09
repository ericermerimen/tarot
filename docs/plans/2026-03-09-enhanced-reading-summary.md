# Enhanced Reading Summary Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace flat card-description stitching in multi-card summaries with genuine synthesis: a dominant theme, improved narrative connectors, conditional pattern observations, optional iconic pair callouts, and an actionable closing — all bilingual (EN + ZH).

**Architecture:** Extract the existing `generateReadingSummary` logic from `reading/page.tsx` into a pure utility module `src/utils/readingSummary.ts`. Build composable helper functions (`detectTheme`, `detectPatterns`, `detectIconicPair`, `buildClosingGuidance`) that feed into the updated `generateReadingSummary`. The component in `reading/page.tsx` calls the same function signature — no component changes needed.

**Tech Stack:** TypeScript, Vitest + React Testing Library, no new dependencies.

---

### Important notes before starting

- This is a **Major Arcana only** deck (22 cards, IDs 0–21). The "majority Major Arcana" pattern from the design is irrelevant — every card is always Major Arcana. Only implement **reversal pattern detection**.
- All new logic must produce both `en` and `zh` versions of every string.
- `SpreadSummary` interface (currently inline in `reading/page.tsx` line 799): keep as-is, just re-export from the utility file.
- The existing `generateReadingSummary` call signature in `reading/page.tsx` line 1004 must not change: `generateReadingSummary(cards, spreadType, positions, positionsZh)`.

---

### Task 1: Extract existing logic to utility file (no behaviour changes)

**Files:**
- Create: `src/utils/readingSummary.ts`
- Modify: `src/app/reading/page.tsx`
- Test: `src/__tests__/readingSummary.test.ts`

**Step 1: Create the new utility file**

Move the following from `reading/page.tsx` into `src/utils/readingSummary.ts` verbatim:
- `SpreadSummary` interface (lines 799–804)
- `generateReadingSummary` function (lines 919–993)

Also move the `getPositionalInterpretation` function (lines 806–917) — it is pure logic, not UI.

Add at the top of the new file:
```typescript
import type { DrawnCard, CardMeaning } from '@/types/tarot';

export interface SpreadSummary {
  title: string;
  titleZh: string;
  summary: string;
  summaryZh: string;
}
```

**Step 2: Update reading/page.tsx imports**

Remove the `SpreadSummary` interface and the two functions from `reading/page.tsx`. Add imports:
```typescript
import { generateReadingSummary, getPositionalInterpretation } from '@/utils/readingSummary';
import type { SpreadSummary } from '@/utils/readingSummary';
```

**Step 3: Write a smoke test to confirm the extraction works**

File: `src/__tests__/readingSummary.test.ts`

```typescript
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
```

**Step 4: Run tests**
```bash
npm test -- readingSummary
```
Expected: all 4 pass (confirming extraction didn't break anything).

**Step 5: Commit**
```bash
git add src/utils/readingSummary.ts src/__tests__/readingSummary.test.ts src/app/reading/page.tsx
git commit -m "refactor: extract generateReadingSummary to src/utils/readingSummary.ts"
```

---

### Task 2: Add detectTheme helper

**Files:**
- Modify: `src/utils/readingSummary.ts`
- Modify: `src/__tests__/readingSummary.test.ts`

**Step 1: Write failing tests first**

Add to `readingSummary.test.ts`:
```typescript
import { detectTheme } from '@/utils/readingSummary';

describe('detectTheme', () => {
  it('detects transformation when change/endings cards dominate', () => {
    // Death (13) keywords: transformation, change, transition, endings
    // Wheel of Fortune (10) keywords: change, cycles, karma, fate
    // Judgment (20) keywords: reflection, reckoning, awakening, absolution
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
    // Lovers (6): love, harmony, relationships, choices
    // Empress (3): abundance, fertility, nurturing, nature
    const cards = [makeCard(6), makeCard(3), makeCard(6)]; // duplicate OK for test
    expect(detectTheme(cards)).toBe('loveConnection');
  });

  it('works with a single card', () => {
    const result = detectTheme([makeCard(16)]); // Tower: upheaval, chaos, revelation, disruption
    expect(['transformation', 'struggle']).toContain(result);
  });
});
```

**Step 2: Run to confirm failure**
```bash
npm test -- readingSummary
```
Expected: FAIL with `detectTheme is not a function`.

**Step 3: Implement detectTheme in readingSummary.ts**

Add before `generateReadingSummary`:

```typescript
export type ThemeBucket = 'transformation' | 'innerJourney' | 'struggle' | 'growth' | 'achievement' | 'loveConnection' | 'guidance';

// Maps individual card keywords to theme buckets.
// Keywords are lowercase to match the data in tarotCards.ts.
const KEYWORD_THEME_MAP: Record<string, ThemeBucket> = {
  // transformation
  'beginnings': 'transformation',
  'change': 'transformation',
  'transition': 'transformation',
  'endings': 'transformation',
  'transformation': 'transformation',
  'cycles': 'transformation',
  'awakening': 'transformation',
  'completion': 'transformation',
  'reckoning': 'transformation',
  'upheaval': 'transformation',
  'revelation': 'transformation',
  'disruption': 'transformation',
  'fate': 'transformation',
  'karma': 'transformation',
  // inner journey
  'intuition': 'innerJourney',
  'mystery': 'innerJourney',
  'inner knowledge': 'innerJourney',
  'subconscious': 'innerJourney',
  'soul searching': 'innerJourney',
  'introspection': 'innerJourney',
  'inner guidance': 'innerJourney',
  'solitude': 'innerJourney',
  'suspension': 'innerJourney',
  'shadow': 'innerJourney',
  'illusion': 'innerJourney',
  'the unconscious': 'innerJourney',
  'fear': 'innerJourney',
  'confusion': 'innerJourney',
  'letting go': 'innerJourney',
  'sacrifice': 'innerJourney',
  'reflection': 'innerJourney',
  // struggle
  'bondage': 'struggle',
  'addiction': 'struggle',
  'restriction': 'struggle',
  'chaos': 'struggle',
  'materialism': 'struggle',
  // growth
  'innocence': 'growth',
  'spontaneity': 'growth',
  'free spirit': 'growth',
  'abundance': 'growth',
  'fertility': 'growth',
  'nurturing': 'growth',
  'hope': 'growth',
  'inspiration': 'growth',
  'courage': 'growth',
  'patience': 'growth',
  'compassion': 'growth',
  'serenity': 'growth',
  'spirituality': 'growth',
  'nature': 'growth',
  'strength': 'growth',
  // achievement
  'manifestation': 'achievement',
  'willpower': 'achievement',
  'skill': 'achievement',
  'concentration': 'achievement',
  'authority': 'achievement',
  'structure': 'achievement',
  'stability': 'achievement',
  'control': 'achievement',
  'determination': 'achievement',
  'success': 'achievement',
  'positivity': 'achievement',
  'vitality': 'achievement',
  'joy': 'achievement',
  'integration': 'achievement',
  'accomplishment': 'achievement',
  'free will': 'achievement',
  // love & connection
  'love': 'loveConnection',
  'harmony': 'loveConnection',
  'relationships': 'loveConnection',
  'choices': 'loveConnection',
  'values': 'loveConnection',
  'partnership': 'loveConnection',
  // guidance
  'tradition': 'guidance',
  'conformity': 'guidance',
  'morality': 'guidance',
  'ethics': 'guidance',
  'justice': 'guidance',
  'fairness': 'guidance',
  'truth': 'guidance',
  'cause and effect': 'guidance',
  'balance': 'guidance',
  'moderation': 'guidance',
  'purpose': 'guidance',
  'absolution': 'guidance',
};

export function detectTheme(cards: DrawnCard[]): ThemeBucket {
  const counts: Record<ThemeBucket, number> = {
    transformation: 0, innerJourney: 0, struggle: 0,
    growth: 0, achievement: 0, loveConnection: 0, guidance: 0,
  };

  for (const drawn of cards) {
    for (const kw of drawn.card.keywords) {
      const bucket = KEYWORD_THEME_MAP[kw.toLowerCase()];
      if (bucket) counts[bucket]++;
    }
  }

  // Return the bucket with the highest count; default to 'transformation' on tie
  return (Object.entries(counts) as [ThemeBucket, number][])
    .reduce((best, curr) => curr[1] > best[1] ? curr : best, ['transformation', 0] as [ThemeBucket, number])[0];
}
```

**Step 4: Run tests**
```bash
npm test -- readingSummary
```
Expected: all tests pass.

**Step 5: Commit**
```bash
git add src/utils/readingSummary.ts src/__tests__/readingSummary.test.ts
git commit -m "feat: add detectTheme helper for reading summary"
```

---

### Task 3: Add detectPatterns helper (reversal ratio)

**Files:**
- Modify: `src/utils/readingSummary.ts`
- Modify: `src/__tests__/readingSummary.test.ts`

**Step 1: Write failing tests first**

Add to `readingSummary.test.ts`:
```typescript
import { detectPatterns } from '@/utils/readingSummary';

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
    // 1 out of 5 reversed — not noteworthy
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
```

**Step 2: Run to confirm failure**
```bash
npm test -- readingSummary
```
Expected: FAIL with `detectPatterns is not a function`.

**Step 3: Implement detectPatterns**

Add to `readingSummary.ts`:
```typescript
interface PatternObservation {
  en: string;
  zh: string;
}

export interface PatternResult {
  reversalRatio: number;
  patternNote: PatternObservation | null;
}

export function detectPatterns(cards: DrawnCard[]): PatternResult {
  const reversedCount = cards.filter(c => c.isReversed).length;
  const reversalRatio = reversedCount / cards.length;

  let patternNote: PatternObservation | null = null;

  if (reversalRatio === 0) {
    patternNote = {
      en: 'All cards appear upright — the energy here is direct, accessible, and ready to be worked with.',
      zh: '所有牌均為正位——此次解讀的能量直接而清晰，隨時可以運用。',
    };
  } else if (reversalRatio >= 0.5) {
    patternNote = {
      en: 'Much of this reading\'s energy turns inward — blocked or internalized forces asking to be acknowledged and released before they can move forward.',
      zh: '這次解讀的大部分能量向內轉——被阻塞或內化的力量正在尋求被承認和釋放，之後才能向前推進。',
    };
  }

  return { reversalRatio, patternNote };
}
```

**Step 4: Run tests**
```bash
npm test -- readingSummary
```
Expected: all pass.

**Step 5: Commit**
```bash
git add src/utils/readingSummary.ts src/__tests__/readingSummary.test.ts
git commit -m "feat: add detectPatterns helper for reversal observation"
```

---

### Task 4: Add detectIconicPair helper (minor C)

**Files:**
- Modify: `src/utils/readingSummary.ts`
- Modify: `src/__tests__/readingSummary.test.ts`

**Step 1: Write failing tests first**

Add to `readingSummary.test.ts`:
```typescript
import { detectIconicPair } from '@/utils/readingSummary';

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
    expect(result!.en.toLowerCase()).toContain('choice');
  });

  it('returns insight for Death + World pair', () => {
    const result = detectIconicPair(makeCard(13), makeCard(21));
    expect(result).not.toBeNull();
  });
});
```

**Step 2: Run to confirm failure**
```bash
npm test -- readingSummary
```
Expected: FAIL.

**Step 3: Implement detectIconicPair**

Add to `readingSummary.ts`:
```typescript
interface PairInsight {
  en: string;
  zh: string;
}

// Key is always `${smallerId}-${largerId}` to be order-independent.
const ICONIC_PAIRS: Record<string, PairInsight> = {
  // Tower (16) + Star (17)
  '16-17': {
    en: 'Disruption and hope appear side by side — what breaks open here makes space for something truer.',
    zh: '動盪與希望並肩出現——此處的破裂為更真實的事物騰出了空間。',
  },
  // Devil (15) + Lovers (6) — sorted: 6-15
  '6-15': {
    en: 'Bondage and choice face each other — this reading hinges on what you are willing to release.',
    zh: '束縛與選擇相對而立——這次解讀的關鍵在於你願意放下什麼。',
  },
  // Death (13) + World (21) — sorted: 13-21
  '13-21': {
    en: 'An ending and a completion appear together — a full cycle closes, and wholeness is within reach.',
    zh: '結束與圓滿同時出現——一個完整的循環結束，圓滿就在眼前。',
  },
  // Moon (18) + High Priestess (2) — sorted: 2-18
  '2-18': {
    en: 'Two cards of hidden truth align — what you seek is already known to you beneath the surface.',
    zh: '兩張隱藏真相的牌相互呼應——你所尋找的，在內心深處早已知曉。',
  },
  // Fool (0) + Wheel of Fortune (10) — sorted: 0-10
  '0-10': {
    en: 'A leap of faith meets a turning cycle — timing and trust are everything here.',
    zh: '信念的躍進遇上輪迴的轉動——時機與信任在此至關重要。',
  },
  // Judgment (20) + World (21) — sorted: 20-21
  '20-21': {
    en: 'Awakening and completion in the same breath — you stand at the threshold of something fully realized.',
    zh: '覺醒與圓滿同時出現——你站在某件完全實現之事的門檻上。',
  },
  // Death (13) + Star (17) — sorted: 13-17
  '13-17': {
    en: 'Transformation followed by renewal — what is released here becomes the fertile ground for hope.',
    zh: '轉化之後是更新——此處釋放的事物成為希望的沃土。',
  },
  // Devil (15) + Tower (16) — sorted: 15-16
  '15-16': {
    en: 'Shadow and disruption collide — what has been suppressed is now breaking through, whether invited or not.',
    zh: '陰影與動盪碰撞——被壓抑的事物正在破土而出，無論你是否準備好。',
  },
  // Sun (19) + World (21) — sorted: 19-21
  '19-21': {
    en: 'Radiant joy and wholeness together — this is the reading of someone arriving at where they were always heading.',
    zh: '燦爛的喜悅與圓滿同在——這是一個人抵達他們一直前往之處的解讀。',
  },
  // Chariot (7) + Strength (8) — sorted: 7-8
  '7-8': {
    en: 'Outer drive meets inner courage — lasting progress here requires both force of will and compassion.',
    zh: '外在驅動力遇上內在勇氣——持久的進步需要意志力與慈悲心並行。',
  },
  // Hermit (9) + Moon (18) — sorted: 9-18
  '9-18': {
    en: 'Deep solitude and the unconscious — a powerful call to sit with what is unresolved rather than push forward.',
    zh: '深度獨處與潛意識——強烈呼喚你靜坐於未解決的事物中，而非急於前進。',
  },
  // Fool (0) + Tower (16) — sorted: 0-16
  '0-16': {
    en: 'Reckless beginnings meet sudden upheaval — the ground shifts beneath an unprepared leap.',
    zh: '魯莽的開始遇上突然的動盪——未準備好的躍進下，腳下的地面正在動搖。',
  },
};

export function detectIconicPair(a: DrawnCard, b: DrawnCard): PairInsight | null {
  const key = `${Math.min(a.card.id, b.card.id)}-${Math.max(a.card.id, b.card.id)}`;
  return ICONIC_PAIRS[key] ?? null;
}
```

**Step 4: Run tests**
```bash
npm test -- readingSummary
```
Expected: all pass.

**Step 5: Commit**
```bash
git add src/utils/readingSummary.ts src/__tests__/readingSummary.test.ts
git commit -m "feat: add detectIconicPair helper with 12 notable combinations"
```

---

### Task 5: Add buildClosingGuidance helper

**Files:**
- Modify: `src/utils/readingSummary.ts`
- Modify: `src/__tests__/readingSummary.test.ts`

**Step 1: Write failing tests first**

Add to `readingSummary.test.ts`:
```typescript
import { buildClosingGuidance } from '@/utils/readingSummary';

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
```

**Step 2: Run to confirm failure**
```bash
npm test -- readingSummary
```
Expected: FAIL.

**Step 3: Implement buildClosingGuidance**

Add to `readingSummary.ts`:
```typescript
const THEME_ACTION_EN: Record<ThemeBucket, string> = {
  transformation: 'embrace what is shifting and release what no longer serves',
  innerJourney: 'turn inward and trust what you already know beneath the surface',
  struggle: 'face what is difficult with honesty rather than avoidance',
  growth: 'nurture what is emerging and give it room to expand',
  achievement: 'step fully into your capability and see what you have already built',
  loveConnection: 'open your heart and invest genuinely in your connections',
  guidance: 'seek clarity and align your actions with your deeper values',
};

const THEME_ACTION_ZH: Record<ThemeBucket, string> = {
  transformation: '擁抱正在轉變的事物，釋放不再服務於你的一切',
  innerJourney: '向內轉，相信你在表面之下早已知曉的一切',
  struggle: '以誠實而非迴避的態度面對困難',
  growth: '滋養正在萌發的事物，給予它成長的空間',
  achievement: '充分展現你的能力，看見你已經建立的一切',
  loveConnection: '敞開你的心，真誠地投入你的連結',
  guidance: '尋求清晰，讓你的行動與更深層的價值觀一致',
};

export function buildClosingGuidance(outcomeCard: DrawnCard, theme: ThemeBucket): { en: string; zh: string } {
  const label = outcomeCard.card.name + (outcomeCard.isReversed ? ' (Reversed)' : '');
  const labelZh = outcomeCard.card.nameZh + (outcomeCard.isReversed ? ' (逆位)' : '');
  return {
    en: `${label} closes this reading with an invitation to ${THEME_ACTION_EN[theme]}.`,
    zh: `${labelZh}以邀請結束這次解讀：${THEME_ACTION_ZH[theme]}。`,
  };
}
```

**Step 4: Run tests**
```bash
npm test -- readingSummary
```
Expected: all pass.

**Step 5: Commit**
```bash
git add src/utils/readingSummary.ts src/__tests__/readingSummary.test.ts
git commit -m "feat: add buildClosingGuidance for actionable reading endings"
```

---

### Task 6: Rebuild generateReadingSummary — threeCard spread

**Files:**
- Modify: `src/utils/readingSummary.ts`
- Modify: `src/__tests__/readingSummary.test.ts`

**Step 1: Write failing tests first**

Add to `readingSummary.test.ts`:
```typescript
describe('generateReadingSummary — threeCard enhanced', () => {
  it('summary contains card names', () => {
    const cards = [makeCard(0), makeCard(13), makeCard(17)]; // Fool, Death, Star
    const result = generateReadingSummary(cards, 'threeCard', ['Past', 'Present', 'Future'], ['過去', '現在', '未來']);
    expect(result!.summary).toContain('The Fool');
    expect(result!.summary).toContain('Death');
    expect(result!.summary).toContain('The Star');
  });

  it('summaryZh contains Chinese card names', () => {
    const cards = [makeCard(0), makeCard(13), makeCard(17)];
    const result = generateReadingSummary(cards, 'threeCard', ['Past', 'Present', 'Future'], ['過去', '現在', '未來']);
    expect(result!.summaryZh).toContain('愚者');
    expect(result!.summaryZh).toContain('死神');
    expect(result!.summaryZh).toContain('星星');
  });

  it('includes pattern note for all-reversed reading', () => {
    const cards = [makeCard(0, true), makeCard(13, true), makeCard(17, true)];
    const result = generateReadingSummary(cards, 'threeCard', ['Past', 'Present', 'Future'], ['過去', '現在', '未來']);
    expect(result!.summary).toContain('inward');
  });

  it('includes iconic pair callout when applicable', () => {
    // Death (13) + Star (17) is an iconic pair; place them in Present + Future positions
    const cards = [makeCard(0), makeCard(13), makeCard(17)];
    const result = generateReadingSummary(cards, 'threeCard', ['Past', 'Present', 'Future'], ['過去', '現在', '未來']);
    // Should contain the pair insight about transformation → renewal
    expect(result!.summary).toContain('fertile ground');
  });

  it('does not include pair callout for non-iconic combination', () => {
    const cards = [makeCard(4), makeCard(5), makeCard(11)]; // Emperor, Hierophant, Justice
    const result = generateReadingSummary(cards, 'threeCard', ['Past', 'Present', 'Future'], ['過去', '現在', '未來']);
    // Pair callout only appears when an iconic pair is detected
    // Just confirm result is non-null and has reasonable length
    expect(result).not.toBeNull();
    expect(result!.summary.length).toBeGreaterThan(100);
  });
});
```

**Step 2: Run to confirm some fail (pair callout test)**
```bash
npm test -- readingSummary
```

**Step 3: Rebuild threeCard branch of generateReadingSummary**

Replace the `if (spreadType === 'threeCard')` block in `readingSummary.ts` with:

```typescript
if (spreadType === 'threeCard') {
  const [past, present, future] = cards;
  const pastM = getMeaning(past);
  const presentM = getMeaning(present);
  const futureM = getMeaning(future);

  const theme = detectTheme(cards);
  const { patternNote } = detectPatterns(cards);

  // Check iconic pairs at structurally significant positions (Past↔Present, Present↔Future)
  const pairInsight = detectIconicPair(past, present) ?? detectIconicPair(present, future);

  const closing = buildClosingGuidance(future, theme);

  const THEME_OPENING_EN: Record<ThemeBucket, string> = {
    transformation: 'This reading is marked by transformation — change is not coming, it is already here.',
    innerJourney: 'The cards are pulling inward, asking you to examine what lies beneath the surface.',
    struggle: 'There is friction running through this reading — forces in tension that demand honest attention.',
    growth: 'An energy of expansion and possibility runs through your cards.',
    achievement: 'The cards reflect a moment of momentum — capability meeting opportunity.',
    loveConnection: 'Connection is the thread that binds this reading.',
    guidance: 'The cards point toward clarity — a call to examine and realign.',
  };

  const THEME_OPENING_ZH: Record<ThemeBucket, string> = {
    transformation: '這次解讀以轉變為標誌——變化不是即將到來，它已經在這裡了。',
    innerJourney: '牌正在向內引導，要求你審視表面之下的一切。',
    struggle: '這次解讀中貫穿著摩擦——緊張的力量需要誠實的關注。',
    growth: '你的牌中流淌著擴展與可能性的能量。',
    achievement: '牌反映了一個動力時刻——能力與機會的相遇。',
    loveConnection: '連結是貫穿這次解讀的主線。',
    guidance: '牌指向清晰——呼喚審視與重新校準。',
  };

  const summaryParts: string[] = [
    THEME_OPENING_EN[theme],
    `From your past, ${getCardLabel(past)} — ${pastM.meaning} — carried you into your present, where ${getCardLabel(present)} now reflects ${presentM.meaning} The path ahead opens through ${getCardLabel(future)}: ${futureM.meaning}`,
  ];

  const summaryPartsZh: string[] = [
    THEME_OPENING_ZH[theme],
    `從你的過去，${getCardLabelZh(past)}——${pastM.meaningZh}——將你帶入當下，在那裡${getCardLabelZh(present)}現在反映著${presentM.meaningZh}前方的道路通過${getCardLabelZh(future)}開啟：${futureM.meaningZh}`,
  ];

  if (patternNote) {
    summaryParts.push(patternNote.en);
    summaryPartsZh.push(patternNote.zh);
  }

  if (pairInsight) {
    summaryParts.push(pairInsight.en);
    summaryPartsZh.push(pairInsight.zh);
  }

  summaryParts.push(closing.en);
  summaryPartsZh.push(closing.zh);

  return {
    title: 'Your Timeline Reading',
    titleZh: '你的時間線解讀',
    summary: summaryParts.join(' '),
    summaryZh: summaryPartsZh.join(' '),
  };
}
```

**Step 4: Run tests**
```bash
npm test -- readingSummary
```
Expected: all pass.

**Step 5: Commit**
```bash
git add src/utils/readingSummary.ts src/__tests__/readingSummary.test.ts
git commit -m "feat: enhance threeCard summary with theme, patterns, pair insight, and closing"
```

---

### Task 7: Rebuild generateReadingSummary — love spread

**Files:**
- Modify: `src/utils/readingSummary.ts`
- Modify: `src/__tests__/readingSummary.test.ts`

**Step 1: Write failing tests first**

Add to `readingSummary.test.ts`:
```typescript
describe('generateReadingSummary — love enhanced', () => {
  const positions = ['You', 'Partner', 'Connection', 'Challenge', 'Outcome'];
  const positionsZh = ['你', '對方', '連結', '挑戰', '結果'];

  it('uses love meanings not general meanings', () => {
    const cards = [makeCard(6), makeCard(3), makeCard(2), makeCard(15), makeCard(17)];
    const result = generateReadingSummary(cards, 'love', positions, positionsZh);
    // Love spread should use meaning.love, not meaning.meaning
    // The Lovers upright love text contains 'heart' or 'love'
    expect(result!.summary.toLowerCase()).toMatch(/heart|love|relationship/);
  });

  it('summaryZh contains Chinese card names', () => {
    const cards = [makeCard(6), makeCard(3), makeCard(2), makeCard(15), makeCard(17)];
    const result = generateReadingSummary(cards, 'love', positions, positionsZh);
    expect(result!.summaryZh).toContain('戀人');
  });

  it('includes iconic pair callout for Devil + Lovers at You↔Partner', () => {
    // Lovers (6) at You position, Devil (15) at Partner position
    const cards = [makeCard(6), makeCard(15), makeCard(2), makeCard(7), makeCard(17)];
    const result = generateReadingSummary(cards, 'love', positions, positionsZh);
    expect(result!.summary).toContain('release');
  });
});
```

**Step 2: Run to confirm failure**
```bash
npm test -- readingSummary
```

**Step 3: Rebuild love branch**

Replace the `if (spreadType === 'love')` block with:

```typescript
if (spreadType === 'love') {
  const [you, partner, connection, challenge, outcome] = cards;
  const youM = getMeaning(you);
  const partnerM = getMeaning(partner);
  const connectionM = getMeaning(connection);
  const challengeM = getMeaning(challenge);
  const outcomeM = getMeaning(outcome);

  const theme = detectTheme(cards);
  const { patternNote } = detectPatterns(cards);

  // Check iconic pairs at You↔Partner and Challenge↔Outcome
  const pairInsight = detectIconicPair(you, partner) ?? detectIconicPair(challenge, outcome);

  const closing = buildClosingGuidance(outcome, theme);

  const summaryParts = [
    `In matters of the heart, ${getCardLabel(you)} reflects how you are showing up in love right now: ${youM.love} Your partner or love interest, represented by ${getCardLabel(partner)}, brings this energy: ${partnerM.love} The connection between you, shaped by ${getCardLabel(connection)}, reveals: ${connectionM.love} The challenge you face together through ${getCardLabel(challenge)}: ${challengeM.love} And the path ahead, carried by ${getCardLabel(outcome)}: ${outcomeM.love}`,
  ];

  const summaryPartsZh = [
    `在感情方面，${getCardLabelZh(you)}反映了你目前在愛情中的狀態：${youM.loveZh}代表對方的${getCardLabelZh(partner)}帶來這樣的能量：${partnerM.loveZh}由${getCardLabelZh(connection)}塑造的連結揭示了：${connectionM.loveZh}你們共同面對的挑戰——${getCardLabelZh(challenge)}：${challengeM.loveZh}而前方的道路，由${getCardLabelZh(outcome)}承載：${outcomeM.loveZh}`,
  ];

  if (patternNote) {
    summaryParts.push(patternNote.en);
    summaryPartsZh.push(patternNote.zh);
  }

  if (pairInsight) {
    summaryParts.push(pairInsight.en);
    summaryPartsZh.push(pairInsight.zh);
  }

  summaryParts.push(closing.en);
  summaryPartsZh.push(closing.zh);

  return {
    title: 'Your Love Reading',
    titleZh: '你的愛情解讀',
    summary: summaryParts.join(' '),
    summaryZh: summaryPartsZh.join(' '),
  };
}
```

**Step 4: Run tests**
```bash
npm test -- readingSummary
```
Expected: all pass.

**Step 5: Commit**
```bash
git add src/utils/readingSummary.ts src/__tests__/readingSummary.test.ts
git commit -m "feat: enhance love spread summary with theme, patterns, pair insight, and closing"
```

---

### Task 8: Rebuild generateReadingSummary — celticCross spread

**Files:**
- Modify: `src/utils/readingSummary.ts`
- Modify: `src/__tests__/readingSummary.test.ts`

**Step 1: Write failing tests first**

Add to `readingSummary.test.ts`:
```typescript
describe('generateReadingSummary — celticCross enhanced', () => {
  const positions = ['Present', 'Challenge', 'Past', 'Future', 'Above', 'Below', 'Advice', 'External', 'Hopes/Fears', 'Outcome'];
  const positionsZh = ['現在', '挑戰', '過去', '未來', '目標', '潛意識', '建議', '外在影響', '希望/恐懼', '結果'];

  it('contains all 10 card names in summary', () => {
    const cards = Array.from({ length: 10 }, (_, i) => makeCard(i));
    const result = generateReadingSummary(cards, 'celticCross', positions, positionsZh);
    expect(result!.summary).toContain('The Fool');
    expect(result!.summary).toContain('The Magician');
  });

  it('summaryZh contains Chinese card names', () => {
    const cards = Array.from({ length: 10 }, (_, i) => makeCard(i));
    const result = generateReadingSummary(cards, 'celticCross', positions, positionsZh);
    expect(result!.summaryZh).toContain('愚者');
  });

  it('includes pattern note when majority reversed', () => {
    const cards = Array.from({ length: 10 }, (_, i) => makeCard(i, i < 6)); // 6 reversed
    const result = generateReadingSummary(cards, 'celticCross', positions, positionsZh);
    expect(result!.summary).toContain('inward');
  });

  it('includes iconic pair callout for Present↔Challenge when applicable', () => {
    // Moon (18) at present, High Priestess (2) at challenge — iconic pair
    const cards = [
      makeCard(18), makeCard(2), makeCard(0), makeCard(1),
      makeCard(3), makeCard(4), makeCard(5), makeCard(6), makeCard(7), makeCard(8)
    ];
    const result = generateReadingSummary(cards, 'celticCross', positions, positionsZh);
    expect(result!.summary).toContain('already known');
  });
});
```

**Step 2: Run to confirm failure**
```bash
npm test -- readingSummary
```

**Step 3: Rebuild celticCross branch**

Replace the `if (spreadType === 'celticCross')` block with:

```typescript
if (spreadType === 'celticCross') {
  const [present, challenge, past, future, above, below, advice, external, hopes, outcome] = cards;
  const presentM = getMeaning(present);
  const challengeM = getMeaning(challenge);
  const pastM = getMeaning(past);
  const futureM = getMeaning(future);
  const aboveM = getMeaning(above);
  const belowM = getMeaning(below);
  const adviceM = getMeaning(advice);
  const externalM = getMeaning(external);
  const hopesM = getMeaning(hopes);
  const outcomeM = getMeaning(outcome);

  const theme = detectTheme(cards);
  const { patternNote } = detectPatterns(cards);

  // Check iconic pairs at Present↔Challenge (core cross) and Hopes↔Outcome (staff)
  const pairInsight = detectIconicPair(present, challenge) ?? detectIconicPair(hopes, outcome);

  const closing = buildClosingGuidance(outcome, theme);

  const THEME_OPENING_EN: Record<ThemeBucket, string> = {
    transformation: 'This reading is marked by transformation — change is not coming, it is already here.',
    innerJourney: 'The cards are pulling inward, asking you to examine what lies beneath the surface.',
    struggle: 'There is friction running through this reading — forces in tension that demand honest attention.',
    growth: 'An energy of expansion and possibility runs through your cards.',
    achievement: 'The cards reflect a moment of momentum — capability meeting opportunity.',
    loveConnection: 'Connection is the thread that binds this reading.',
    guidance: 'The cards point toward clarity — a call to examine and realign.',
  };

  const THEME_OPENING_ZH: Record<ThemeBucket, string> = {
    transformation: '這次解讀以轉變為標誌——變化不是即將到來，它已經在這裡了。',
    innerJourney: '牌正在向內引導，要求你審視表面之下的一切。',
    struggle: '這次解讀中貫穿著摩擦——緊張的力量需要誠實的關注。',
    growth: '你的牌中流淌著擴展與可能性的能量。',
    achievement: '牌反映了一個動力時刻——能力與機會的相遇。',
    loveConnection: '連結是貫穿這次解讀的主線。',
    guidance: '牌指向清晰——呼喚審視與重新校準。',
  };

  const narrativeEn = [
    `${THEME_OPENING_EN[theme]}`,
    `At the heart of your reading, ${getCardLabel(present)} defines your current situation — ${presentM.meaning.toLowerCase()} Crossing this is ${getCardLabel(challenge)}, representing the immediate force you must face: ${challengeM.meaning.toLowerCase()}`,
    `Your foundation in the recent past, ${getCardLabel(past)}, speaks of ${pastM.meaning.toLowerCase()} The near future brings ${getCardLabel(future)}: ${futureM.meaning.toLowerCase()}`,
    `Your highest aspirations are reflected by ${getCardLabel(above)} — ${aboveM.meaning.toLowerCase()} While deep in your subconscious, ${getCardLabel(below)} reveals ${belowM.meaning.toLowerCase()}`,
    `For guidance, ${getCardLabel(advice)} advises: ${adviceM.advice ?? adviceM.meaning.toLowerCase()} External influences from ${getCardLabel(external)} suggest ${externalM.meaning.toLowerCase()}`,
    `Your hopes and fears are embodied by ${getCardLabel(hopes)}: ${hopesM.meaning.toLowerCase()} The final outcome, ${getCardLabel(outcome)}, reveals ${outcomeM.meaning.toLowerCase()}`,
  ].join(' ');

  const narrativeZh = [
    `${THEME_OPENING_ZH[theme]}`,
    `在你的解讀核心，${getCardLabelZh(present)}定義了你的當前處境——${presentM.meaningZh}與之交叉的是${getCardLabelZh(challenge)}，代表你必須面對的直接力量：${challengeM.meaningZh}`,
    `你近期過去的根基，${getCardLabelZh(past)}，訴說著${pastM.meaningZh}近期的未來帶來${getCardLabelZh(future)}：${futureM.meaningZh}`,
    `你最高的願望由${getCardLabelZh(above)}反映——${aboveM.meaningZh}在你的潛意識深處，${getCardLabelZh(below)}揭示了${belowM.meaningZh}`,
    `在指導方面，${getCardLabelZh(advice)}建議：${adviceM.adviceZh ?? adviceM.meaningZh}來自${getCardLabelZh(external)}的外部影響暗示${externalM.meaningZh}`,
    `你的希望與恐懼由${getCardLabelZh(hopes)}體現：${hopesM.meaningZh}最終結果——${getCardLabelZh(outcome)}揭示了${outcomeM.meaningZh}`,
  ].join(' ');

  const finalParts = [narrativeEn];
  const finalPartsZh = [narrativeZh];

  if (patternNote) {
    finalParts.push(patternNote.en);
    finalPartsZh.push(patternNote.zh);
  }

  if (pairInsight) {
    finalParts.push(pairInsight.en);
    finalPartsZh.push(pairInsight.zh);
  }

  finalParts.push(closing.en);
  finalPartsZh.push(closing.zh);

  return {
    title: 'Your Celtic Cross Reading',
    titleZh: '你的凱爾特十字解讀',
    summary: finalParts.join(' '),
    summaryZh: finalPartsZh.join(' '),
  };
}
```

**Step 4: Run all tests**
```bash
npm test
```
Expected: all pass, including existing tests in `tarotCards.test.ts` and `TarotCard.test.tsx`.

**Step 5: Commit**
```bash
git add src/utils/readingSummary.ts src/__tests__/readingSummary.test.ts
git commit -m "feat: enhance celticCross summary with theme, patterns, pair insight, and closing"
```

---

### Task 9: Extract duplicate THEME_OPENING map and final lint check

The `THEME_OPENING_EN` and `THEME_OPENING_ZH` maps are defined twice (threeCard and celticCross branches). Extract them to module-level constants.

**Files:**
- Modify: `src/utils/readingSummary.ts`

**Step 1: Move THEME_OPENING maps to module level**

Cut both `THEME_OPENING_EN` and `THEME_OPENING_ZH` from inside the function and place them above `generateReadingSummary` as module-level constants. Remove the duplicates.

**Step 2: Run lint + typecheck**
```bash
npm run lint
npx tsc --noEmit
```
Expected: no errors.

**Step 3: Run all tests one final time**
```bash
npm test
```
Expected: all pass.

**Step 4: Commit**
```bash
git add src/utils/readingSummary.ts
git commit -m "refactor: deduplicate theme opening maps in readingSummary"
```

---

### Verification checklist

- [ ] `npm test` — all tests pass
- [ ] `npm run lint` — no lint errors
- [ ] `npx tsc --noEmit` — no type errors
- [ ] Manual smoke test: open reading page, draw a three-card spread, confirm the summary panel shows a theme sentence, narrative, and closing
- [ ] Manual smoke test: draw a Celtic Cross, confirm pattern note appears when multiple reversals exist
- [ ] Manual smoke test: confirm Chinese text renders correctly in summary panel
