export interface CardMeaning {
  meaning: string;
  meaningZh: string;
  love: string;
  loveZh: string;
  career: string;
  careerZh: string;
  health?: string;
  healthZh?: string;
  advice?: string;
  adviceZh?: string;
}

export interface TarotCardData {
  id: number;
  name: string;
  nameZh: string;
  dogBreed: string;
  dogBreedZh: string;
  description?: string;
  numerology?: number;
  numerologyMeaning?: string;
  numerologyMeaningZh?: string;
  symbols?: string[];
  symbolsZh?: string[];
  keywords: string[];
  keywordsZh: string[];
  upright: CardMeaning;
  reversed: CardMeaning;
  reflectionQuestions?: string[];
  reflectionQuestionsZh?: string[];
  affirmation?: string;
  affirmationZh?: string;
  element: string;
  zodiac: string;
  colors: string[];
}

export interface DrawnCard {
  card: TarotCardData;
  isReversed: boolean;
}

export interface SpreadType {
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  count: number;
  positions: string[];
  positionsZh: string[];
}

export type SpreadKey = 'single' | 'threeCard' | 'love' | 'celticCross';

export type CardSize = 'small' | 'medium' | 'large';
