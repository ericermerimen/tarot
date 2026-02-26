import type { SpreadKey } from './tarot';

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
}

export interface DailyCardStorage {
  date: string;
  cardId: number;
  isReversed: boolean;
}
