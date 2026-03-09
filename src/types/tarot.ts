export interface CardMeaning {
  meaning: string;
  meaningZh: string;
  meaningJa: string;
  love: string;
  loveZh: string;
  loveJa: string;
  career: string;
  careerZh: string;
  careerJa: string;
  health?: string;
  healthZh?: string;
  healthJa?: string;
  advice?: string;
  adviceZh?: string;
  adviceJa?: string;
}

export interface TarotCardData {
  id: number;
  name: string;
  nameZh: string;
  nameJa: string;
  dogBreed: string;
  dogBreedZh: string;
  dogBreedJa: string;
  description?: string;
  numerology?: number;
  numerologyMeaning?: string;
  numerologyMeaningZh?: string;
  numerologyMeaningJa?: string;
  symbols?: string[];
  symbolsZh?: string[];
  symbolsJa?: string[];
  keywords: string[];
  keywordsZh: string[];
  keywordsJa: string[];
  upright: CardMeaning;
  reversed: CardMeaning;
  reflectionQuestions?: string[];
  reflectionQuestionsZh?: string[];
  reflectionQuestionsJa?: string[];
  affirmation?: string;
  affirmationZh?: string;
  affirmationJa?: string;
  element: string;
  zodiac: string;
  colors: string[];
  imagePath?: string;
}

export interface DrawnCard {
  card: TarotCardData;
  isReversed: boolean;
}

export interface SpreadType {
  name: string;
  nameZh: string;
  nameJa: string;
  description: string;
  descriptionZh: string;
  descriptionJa: string;
  count: number;
  positions: string[];
  positionsZh: string[];
  positionsJa: string[];
}

export type SpreadKey = 'single' | 'threeCard' | 'love' | 'celticCross';

export type CardSize = 'small' | 'medium' | 'large';
