import type { CardMeaning, TarotCardData, SpreadType } from '@/types/tarot';
import type { Locale } from '@/i18n/routing';

/**
 * Get a localized card name based on the current locale.
 * Falls back to English for unsupported locales.
 */
export function getCardName(card: TarotCardData, locale: Locale): string {
  switch (locale) {
    case 'zhTW':
      return card.nameZh;
    case 'jp':
      // JP falls back to English name (no JP data in card definitions yet)
      return card.name;
    default:
      return card.name;
  }
}

export function getCardBreed(card: TarotCardData, locale: Locale): string {
  switch (locale) {
    case 'zhTW':
      return card.dogBreedZh;
    default:
      return card.dogBreed;
  }
}

export function getKeywords(card: TarotCardData, locale: Locale): string[] {
  switch (locale) {
    case 'zhTW':
      return card.keywordsZh;
    default:
      return card.keywords;
  }
}

export function getMeaning(meaning: CardMeaning, locale: Locale) {
  switch (locale) {
    case 'zhTW':
      return {
        meaning: meaning.meaningZh,
        love: meaning.loveZh,
        career: meaning.careerZh,
        health: meaning.healthZh,
        advice: meaning.adviceZh,
      };
    default:
      return {
        meaning: meaning.meaning,
        love: meaning.love,
        career: meaning.career,
        health: meaning.health,
        advice: meaning.advice,
      };
  }
}

export function getReflectionQuestions(card: TarotCardData, locale: Locale): string[] | undefined {
  switch (locale) {
    case 'zhTW':
      return card.reflectionQuestionsZh;
    default:
      return card.reflectionQuestions;
  }
}

export function getAffirmation(card: TarotCardData, locale: Locale): string | undefined {
  switch (locale) {
    case 'zhTW':
      return card.affirmationZh;
    default:
      return card.affirmation;
  }
}

export function getSpreadName(spread: SpreadType, locale: Locale): string {
  switch (locale) {
    case 'zhTW':
      return spread.nameZh;
    default:
      return spread.name;
  }
}

export function getSpreadDescription(spread: SpreadType, locale: Locale): string {
  switch (locale) {
    case 'zhTW':
      return spread.descriptionZh;
    default:
      return spread.description;
  }
}

export function getPositions(spread: SpreadType, locale: Locale): string[] {
  switch (locale) {
    case 'zhTW':
      return spread.positionsZh;
    default:
      return spread.positions;
  }
}
