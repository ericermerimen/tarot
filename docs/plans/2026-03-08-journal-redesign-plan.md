# Journal Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the journal from a passive read log into an active reflection tool with intention tags, personal notes, and pattern-surfacing insights.

**Architecture:** Extend `ReadingRecord` with optional `intention` and `reflection` fields. Add a pre-save intention prompt on the reading page. Restructure the journal page to show an `InsightsPanel` (stats from history) above the enhanced entry timeline.

**Tech Stack:** Next.js 16 App Router, TypeScript strict, MUI v5, Motion for React, Vitest + React Testing Library, localStorage only.

---

### Task 1: Extend the ReadingRecord type

**Files:**
- Modify: `src/types/reading.ts`

**Step 1: Update the type**

Replace the contents of `src/types/reading.ts` with:

```ts
import type { SpreadKey } from './tarot';

export type IntentionTag = 'general' | 'career' | 'love' | 'self' | 'finance' | 'health';

export interface ReadingIntention {
  tag: IntentionTag;
  note?: string;
}

export interface ReadingCardRecord {
  cardId: number;
  isReversed: boolean;
  position: string;
  positionZh: string;
}

export interface ReadingRecord {
  date: string;
  spread: SpreadKey;
  cards: ReadingCardRecord[];
  intention?: ReadingIntention;
  reflection?: string;
}

export interface DailyCardStorage {
  date: string;
  cardId: number;
  isReversed: boolean;
}
```

**Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors (new fields are optional — existing records remain valid).

**Step 3: Commit**

```bash
git add src/types/reading.ts
git commit -m "feat: extend ReadingRecord with intention and reflection fields"
```

---

### Task 2: Create journalStats helper with tests

**Files:**
- Create: `src/lib/journalStats.ts`
- Create: `src/__tests__/journalStats.test.ts`

**Step 1: Write the failing tests first**

Create `src/__tests__/journalStats.test.ts`:

```ts
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
```

**Step 2: Run to confirm failures**

```bash
npm test -- journalStats
```
Expected: all tests FAIL (module not found).

**Step 3: Create the implementation**

Create `src/lib/journalStats.ts`:

```ts
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
  let cursor = new Date(today);

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
```

**Step 4: Run tests**

```bash
npm test -- journalStats
```
Expected: all tests PASS.

**Step 5: Commit**

```bash
git add src/lib/journalStats.ts src/__tests__/journalStats.test.ts
git commit -m "feat: add journalStats helper with unit tests"
```

---

### Task 3: Add intention prompt to the reading page

**Files:**
- Modify: `src/app/reading/page.tsx`

The save flow currently calls `saveReading()` directly. We'll intercept it with a small inline prompt that appears when the user clicks "SAVE_TO_JOURNAL". No dialog — inline panel below the action buttons, consistent with the terminal aesthetic.

**Step 1: Add state and the IntentionPrompt UI**

In `ReadingContent`, add after the existing state declarations (around line 31):

```tsx
const [showIntentionPrompt, setShowIntentionPrompt] = useState(false);
const [selectedTag, setSelectedTag] = useState<string>('general');
const [intentionNote, setIntentionNote] = useState('');
const [saved, setSaved] = useState(false);
```

**Step 2: Replace the `saveReading` function**

Replace the existing `saveReading` function (lines 65–82) with:

```tsx
const confirmSave = () => {
  const reading: ReadingRecord = {
    date: new Date().toISOString(),
    spread: selectedSpread,
    cards: cards.map((c, i) => ({
      cardId: c.card.id,
      isReversed: c.isReversed,
      position: currentSpread.positions[i],
      positionZh: currentSpread.positionsZh[i],
    })),
    intention: {
      tag: selectedTag as import('@/types/reading').IntentionTag,
      note: intentionNote.trim() || undefined,
    },
  };

  const history: ReadingRecord[] = JSON.parse(localStorage.getItem('tarotHistory') || '[]');
  history.unshift(reading);
  localStorage.setItem('tarotHistory', JSON.stringify(history.slice(0, 50)));

  setShowIntentionPrompt(false);
  setSaved(true);
  setIntentionNote('');
};
```

**Step 3: Update the save button and add the intention prompt panel**

Replace the actions `Box` (lines 332–349) with:

```tsx
<Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
  <Button
    variant="outlined"
    startIcon={<RefreshIcon />}
    onClick={() => { startNewReading(); setSaved(false); setShowIntentionPrompt(false); }}
  >
    NEW_READING 重新占卜
  </Button>
  {readingComplete && !saved && (
    <Button
      variant="outlined"
      startIcon={<SaveIcon />}
      onClick={() => setShowIntentionPrompt(true)}
    >
      SAVE_TO_JOURNAL 保存到日記
    </Button>
  )}
  {saved && (
    <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'primary.main', letterSpacing: '0.08em', alignSelf: 'center' }}>
      SAVED ✓ · 已保存
    </Typography>
  )}
</Box>

{/* Intention prompt */}
<AnimatePresence>
  {showIntentionPrompt && (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.25 }}
    >
      <Box sx={{ mt: 3, p: 2.5, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'secondary.dark', letterSpacing: '0.1em', mb: 2 }}>
          INTENT > WHAT ARE YOU ASKING ABOUT? · 你在問什麼？
        </Typography>

        {/* Tag chips */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 2 }}>
          {(['general', 'career', 'love', 'self', 'finance', 'health'] as const).map((tag) => (
            <Box
              key={tag}
              component="button"
              onClick={() => setSelectedTag(tag)}
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                letterSpacing: '0.08em',
                px: 1.25,
                py: 0.5,
                border: '1px solid',
                borderColor: selectedTag === tag ? 'primary.main' : 'divider',
                color: selectedTag === tag ? 'primary.main' : 'secondary.dark',
                bgcolor: 'transparent',
                cursor: 'pointer',
                '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
              }}
            >
              {tag.toUpperCase()}
            </Box>
          ))}
        </Box>

        {/* Optional note */}
        <Box
          component="input"
          placeholder="Optional context... (optional 可選)"
          value={intentionNote}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIntentionNote(e.target.value)}
          sx={{
            width: '100%',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'text.primary',
            bgcolor: 'background.default',
            border: '1px solid',
            borderColor: 'divider',
            p: 1,
            mb: 2,
            outline: 'none',
            '&:focus': { borderColor: 'primary.main' },
            '&::placeholder': { color: 'secondary.dark' },
          }}
        />

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            onClick={confirmSave}
            sx={{
              fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.08em',
              borderRadius: 0, bgcolor: 'primary.main', color: 'background.default', boxShadow: 'none',
              '&:hover': { bgcolor: 'primary.dark', boxShadow: 'none' },
            }}
          >
            CONFIRM_SAVE →
          </Button>
          <Button
            onClick={() => setShowIntentionPrompt(false)}
            sx={{
              fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.08em',
              borderRadius: 0, border: '1px solid', borderColor: 'divider', color: 'secondary.dark',
              '&:hover': { borderColor: 'text.secondary', color: 'text.secondary' },
            }}
          >
            SKIP
          </Button>
        </Box>
      </Box>
    </motion.div>
  )}
</AnimatePresence>
```

Also add a `confirmSaveWithoutIntention` for the SKIP button — replace SKIP's `onClick` with:

```tsx
onClick={() => {
  // Save without intention
  const reading: ReadingRecord = {
    date: new Date().toISOString(),
    spread: selectedSpread,
    cards: cards.map((c, i) => ({
      cardId: c.card.id,
      isReversed: c.isReversed,
      position: currentSpread.positions[i],
      positionZh: currentSpread.positionsZh[i],
    })),
  };
  const history: ReadingRecord[] = JSON.parse(localStorage.getItem('tarotHistory') || '[]');
  history.unshift(reading);
  localStorage.setItem('tarotHistory', JSON.stringify(history.slice(0, 50)));
  setShowIntentionPrompt(false);
  setSaved(true);
}}
```

**Step 4: Add the missing import**

At the top of the file, add `IntentionTag` to the reading import:

```ts
import type { ReadingRecord, IntentionTag } from '@/types/reading';
```

(Remove the inline `import('@/types/reading').IntentionTag` cast used above — use the imported type directly.)

**Step 5: Type-check and lint**

```bash
npx tsc --noEmit && npm run lint
```
Expected: no errors.

**Step 6: Commit**

```bash
git add src/app/reading/page.tsx
git commit -m "feat: add intention prompt to reading save flow"
```

---

### Task 4: Create InsightsPanel component

**Files:**
- Create: `src/components/InsightsPanel.tsx`

This component receives `readings: ReadingRecord[]` and renders the stats panel. It renders nothing if fewer than 3 entries exist.

```tsx
'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { tarotCards } from '@/data/tarotCards';
import { computeStreak, topCard, topCardByTag, reversalRate } from '@/lib/journalStats';
import type { ReadingRecord, IntentionTag } from '@/types/reading';

const TAGS: IntentionTag[] = ['career', 'love', 'self', 'finance', 'health', 'general'];

const TAG_LABELS: Record<IntentionTag, string> = {
  career: 'CAREER',
  love: 'LOVE',
  self: 'SELF',
  finance: 'FINANCE',
  health: 'HEALTH',
  general: 'GENERAL',
};

interface StatRowProps {
  label: string;
  value: string;
}

function StatRow({ label, value }: StatRowProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', py: 0.75, borderBottom: '1px solid', borderBottomColor: 'divider' }}>
      <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'secondary.dark', letterSpacing: '0.08em' }}>
        {label}
      </Typography>
      <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'text.primary', letterSpacing: '0.04em' }}>
        {value}
      </Typography>
    </Box>
  );
}

interface InsightsPanelProps {
  readings: ReadingRecord[];
}

export default function InsightsPanel({ readings }: InsightsPanelProps) {
  if (readings.length < 3) return null;

  const streak = computeStreak(readings);
  const topCardId = topCard(readings);
  const topCardData = topCardId !== null ? tarotCards.find((c) => c.id === topCardId) : null;
  const rate = reversalRate(readings);

  // This month's top card
  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthReadings = readings.filter((r) => r.date.startsWith(thisMonth));
  const monthTopId = topCard(monthReadings);
  const monthTopCard = monthTopId !== null ? tarotCards.find((c) => c.id === monthTopId) : null;

  // Per-tag insights (only tags with ≥ 2 readings)
  const tagInsights: { tag: IntentionTag; cardName: string; cardNameZh: string }[] = [];
  for (const tag of TAGS) {
    const tagCount = readings.filter((r) => r.intention?.tag === tag).length;
    if (tagCount < 2) continue;
    const cardId = topCardByTag(readings, tag);
    if (cardId === null) continue;
    const card = tarotCards.find((c) => c.id === cardId);
    if (card) tagInsights.push({ tag, cardName: card.name, cardNameZh: card.nameZh });
  }

  return (
    <Box sx={{ mb: 4, p: 2.5, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
      {/* Panel header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'primary.main' }} />
        <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', color: 'secondary.dark' }}>
          INSIGHTS
        </Typography>
      </Box>

      {/* Core stats */}
      {topCardData && (
        <StatRow
          label="TOP_CARD (all time)"
          value={`${topCardData.name.toUpperCase()} · ${topCardData.nameZh}`}
        />
      )}
      {monthTopCard && monthReadings.length >= 2 && (
        <StatRow
          label={`TOP_CARD (${thisMonth})`}
          value={`${monthTopCard.name.toUpperCase()} · ${monthTopCard.nameZh}`}
        />
      )}
      <StatRow label="STREAK" value={streak > 0 ? `${streak} DAY${streak === 1 ? '' : 'S'} · 連續 ${streak} 天` : 'NO_STREAK'} />
      <StatRow label="REVERSAL_RATE" value={`${rate}% reversed · ${rate}% 逆位`} />

      {/* Per-tag patterns */}
      {tagInsights.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'secondary.dark', letterSpacing: '0.1em', mb: 1 }}>
            PATTERNS_BY_INTENT ————————
          </Typography>
          {tagInsights.map(({ tag, cardName, cardNameZh }) => (
            <StatRow
              key={tag}
              label={`IN ${TAG_LABELS[tag]}`}
              value={`${cardName.toUpperCase()} · ${cardNameZh}`}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
```

**Step 2: Type-check**

```bash
npx tsc --noEmit
```
Expected: no errors.

**Step 3: Commit**

```bash
git add src/components/InsightsPanel.tsx
git commit -m "feat: add InsightsPanel component with stats"
```

---

### Task 5: Update journal page

**Files:**
- Modify: `src/app/journal/page.tsx`

**Step 1: Add imports at the top**

Add to existing imports:

```tsx
import InsightsPanel from '@/components/InsightsPanel';
import type { IntentionTag } from '@/types/reading';
```

**Step 2: Add reflection edit state**

After `const [deleteTarget, setDeleteTarget] = useState<number | 'all' | null>(null);`, add:

```tsx
const [editingReflection, setEditingReflection] = useState<number | null>(null);
const [reflectionDraft, setReflectionDraft] = useState('');
```

**Step 3: Add saveReflection handler**

After the `toggleExpand` function, add:

```tsx
const saveReflection = (index: number) => {
  const updated = readings.map((r, i) =>
    i === index ? { ...r, reflection: reflectionDraft.trim() || undefined } : r
  );
  setReadings(updated);
  localStorage.setItem('tarotHistory', JSON.stringify(updated));
  setEditingReflection(null);
};

const startEditReflection = (index: number, current?: string) => {
  setReflectionDraft(current ?? '');
  setEditingReflection(index);
};
```

**Step 4: Add InsightsPanel above the entry list**

In the return JSX, after the header `Box` (after line 140), and before the empty-state / list conditional, add:

```tsx
<InsightsPanel readings={readings} />
```

**Step 5: Show intention tag in the row header**

Inside the row header `Box` (after the spread name Typography, around line 269), add:

```tsx
{reading.intention && (
  <Typography
    sx={{
      fontFamily: 'var(--font-mono)',
      fontSize: '0.6rem',
      color: 'secondary.dark',
      letterSpacing: '0.08em',
    }}
  >
    {'INTENT > '}{reading.intention.tag.toUpperCase()}
    {reading.intention.note && (
      <Box component="span" sx={{ color: 'text.secondary', ml: 1 }}>
        · {reading.intention.note}
      </Box>
    )}
  </Typography>
)}
```

**Step 6: Add reflection section inside the expanded card details**

At the bottom of the expanded `Box` (after the last card's detail row, before the closing `</Box>` of the expanded panel), add:

```tsx
{/* Reflection */}
<Box sx={{ px: 2, py: 1.5, borderTop: '1px solid', borderTopColor: 'divider' }}>
  <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'secondary.dark', letterSpacing: '0.1em', mb: 1 }}>
    REFLECTION · 反思
  </Typography>
  {editingReflection === index ? (
    <Box>
      <Box
        component="textarea"
        value={reflectionDraft}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReflectionDraft(e.target.value)}
        placeholder="Write your reflection... 寫下你的反思..."
        rows={3}
        autoFocus
        sx={{
          width: '100%',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          color: 'text.primary',
          bgcolor: 'background.default',
          border: '1px solid',
          borderColor: 'primary.main',
          p: 1,
          resize: 'vertical',
          outline: 'none',
          display: 'block',
          mb: 1,
          '&::placeholder': { color: 'secondary.dark' },
        }}
      />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Box
          component="button"
          onClick={() => saveReflection(index)}
          sx={{
            fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.08em',
            color: 'primary.main', cursor: 'pointer', background: 'none', border: 'none', p: 0,
            '&:hover': { color: 'text.primary' },
          }}
        >
          SAVE
        </Box>
        <Box
          component="button"
          onClick={() => setEditingReflection(null)}
          sx={{
            fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.08em',
            color: 'secondary.dark', cursor: 'pointer', background: 'none', border: 'none', p: 0,
            '&:hover': { color: 'text.secondary' },
          }}
        >
          CANCEL
        </Box>
      </Box>
    </Box>
  ) : (
    <Box
      onClick={() => startEditReflection(index, reading.reflection)}
      sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
    >
      {reading.reflection ? (
        <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'text.secondary', lineHeight: 1.7 }}>
          {reading.reflection}
        </Typography>
      ) : (
        <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'secondary.dark', fontStyle: 'italic' }}>
          + ADD REFLECTION · 新增反思
        </Typography>
      )}
    </Box>
  )}
</Box>
```

**Step 7: Show reflection snippet in collapsed row**

Inside the row header `Box`, after the intention tag (Step 5), add a snippet if not expanded:

```tsx
{!isExpanded && reading.reflection && (
  <Typography
    sx={{
      fontFamily: 'var(--font-mono)',
      fontSize: '0.6rem',
      color: 'text.secondary',
      letterSpacing: '0.04em',
      mt: 0.25,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      maxWidth: '60ch',
    }}
  >
    {reading.reflection.slice(0, 80)}{reading.reflection.length > 80 ? '…' : ''}
  </Typography>
)}
```

**Step 8: Type-check and lint**

```bash
npx tsc --noEmit && npm run lint
```
Expected: no errors.

**Step 9: Commit**

```bash
git add src/app/journal/page.tsx
git commit -m "feat: enhance journal with InsightsPanel, intention tags, and reflection editing"
```

---

### Task 6: Smoke test in browser

```bash
npm run dev
```

Verify:
1. Go to `/reading`, complete a spread, click SAVE_TO_JOURNAL → intention prompt appears with tag chips and optional note field
2. Pick a tag, optionally add a note, click CONFIRM_SAVE → "SAVED ✓" appears, no alert()
3. Click SKIP → saves without intention
4. Go to `/journal` → entry appears with `INTENT > CAREER` (or whichever tag)
5. Expand entry → reflection section shows "+ ADD REFLECTION", click it → textarea appears, type, click SAVE → text persists on reload
6. After 3+ entries, InsightsPanel appears above the list with stats

**Step 10: Final commit if any fixups were made**

```bash
git add -p
git commit -m "fix: journal redesign smoke test fixups"
```
