# Journal Redesign — Design Document

Date: 2026-03-08

## Problem

The current journal is a passive log. It records what cards were drawn but gives users nothing to engage with. There are no personal notes, no context for why a reading was done, and no way to surface patterns over time.

## Goal

Transform the journal into an active reflection tool that rewards both casual users (zero friction, just draw and save) and serious practitioners (intention setting, personal notes, pattern discovery).

## Data Model

Extend `ReadingRecord` in `src/types/reading.ts`:

```ts
export interface ReadingRecord {
  date: string;
  spread: SpreadKey;
  cards: ReadingCardRecord[];
  intention?: {
    tag: string;   // preset: 'general' | 'career' | 'love' | 'self' | 'finance' | 'health'
    note?: string; // optional free text
  };
  reflection?: string; // post-reading note, plain text
}
```

Both fields are optional. Existing records without them remain valid. The model is flat and stays in `localStorage`, structured to support future backend migration.

## Features

### 1. Intention Prompt (Reading Page)

Before a reading is saved, an optional step asks "What are you asking about?" Users pick from preset tags:

`GENERAL / CAREER / LOVE / SELF / FINANCE / HEALTH`

Plus an optional free-text field for specific context. Skippable — no friction for casual users.

### 2. Insights Panel (Journal Top)

A compact stats panel above the entry list. Sections only render when there is enough data (≥ 3 entries).

- **Most drawn card** — all time and this month
- **Streak** — consecutive days with at least one reading
- **Card by intention** — most recurring card per tag (e.g. "In CAREER readings: The Emperor")
- **Reversal rate** — % of cards drawn reversed
- **Last seen** — how many days since a specific card last appeared

Styled in the existing instrument/terminal mono aesthetic.

### 3. Enhanced Timeline (Journal Entry List)

Existing expand/collapse and delete behavior unchanged. Each row gains:

- Intention tag shown inline: `INTENT > CAREER`
- Reflection snippet shown collapsed; full text on expand
- Inline edit for reflection — click to edit, saves to `localStorage` on blur

## Architecture

| File | Change |
|---|---|
| `src/types/reading.ts` | Add `intention` and `reflection` fields to `ReadingRecord` |
| `src/app/reading/page.tsx` | Add optional intention prompt before saving a reading |
| `src/app/journal/page.tsx` | Add `InsightsPanel`, enhance entry rows with intention/reflection |
| `src/components/InsightsPanel.tsx` | New component — renders stats derived from readings |
| `src/lib/journalStats.ts` | New helper — pure functions for computing stats from `ReadingRecord[]` |

No new dependencies. All state stays client-side in `localStorage`.

## Out of Scope

- Backend persistence / auth (future migration path left open by data model)
- AI-generated interpretations
- Export / share features
- Search or filter within the journal list
