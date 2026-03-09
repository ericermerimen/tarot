import type { CardMeaning, TarotCardData, SpreadType } from '@/types/tarot';
import type { Locale } from '@/i18n/routing';

/**
 * Helper to select the correct localized text from en/zhTW/ja variants.
 */
export function selectLocaleText(locale: Locale, en: string, zhTW: string, ja: string): string {
  switch (locale) {
    case 'zhTW':
      return zhTW;
    case 'ja':
      return ja;
    default:
      return en;
  }
}

export function getCardName(card: TarotCardData, locale: Locale): string {
  return selectLocaleText(locale, card.name, card.nameZh, card.nameJa);
}

export function getCardBreed(card: TarotCardData, locale: Locale): string {
  return selectLocaleText(locale, card.dogBreed, card.dogBreedZh, card.dogBreedJa);
}

export function getKeywords(card: TarotCardData, locale: Locale): string[] {
  switch (locale) {
    case 'zhTW':
      return card.keywordsZh;
    case 'ja':
      return card.keywordsJa;
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
    case 'ja':
      return {
        meaning: meaning.meaningJa,
        love: meaning.loveJa,
        career: meaning.careerJa,
        health: meaning.healthJa,
        advice: meaning.adviceJa,
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
    case 'ja':
      return card.reflectionQuestionsJa;
    default:
      return card.reflectionQuestions;
  }
}

export function getAffirmation(card: TarotCardData, locale: Locale): string | undefined {
  switch (locale) {
    case 'zhTW':
      return card.affirmationZh;
    case 'ja':
      return card.affirmationJa;
    default:
      return card.affirmation;
  }
}

export function getSpreadName(spread: SpreadType, locale: Locale): string {
  return selectLocaleText(locale, spread.name, spread.nameZh, spread.nameJa);
}

export function getSpreadDescription(spread: SpreadType, locale: Locale): string {
  return selectLocaleText(locale, spread.description, spread.descriptionZh, spread.descriptionJa);
}

export function getPositions(spread: SpreadType, locale: Locale): string[] {
  switch (locale) {
    case 'zhTW':
      return spread.positionsZh;
    case 'ja':
      return spread.positionsJa;
    default:
      return spread.positions;
  }
}
