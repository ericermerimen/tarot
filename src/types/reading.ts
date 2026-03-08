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
