import { describe, it, expect } from 'vitest'
import { tarotCards } from '@/data/tarotCards'
import type { TarotCardData, CardMeaning } from '@/types/tarot'
import type { ReadingRecord, DailyCardStorage } from '@/types/reading'

describe('type contracts', () => {
  it('CardMeaning has required and optional fields', () => {
    const card = tarotCards[0]
    const meaning: CardMeaning = card.upright
    // Required fields
    expect(typeof meaning.meaning).toBe('string')
    expect(typeof meaning.meaningZh).toBe('string')
    expect(typeof meaning.love).toBe('string')
    expect(typeof meaning.loveZh).toBe('string')
    expect(typeof meaning.career).toBe('string')
    expect(typeof meaning.careerZh).toBe('string')
    // Optional fields may or may not exist
    if (meaning.health !== undefined) {
      expect(typeof meaning.health).toBe('string')
    }
    if (meaning.advice !== undefined) {
      expect(typeof meaning.advice).toBe('string')
    }
  })

  it('TarotCardData optional fields are correctly typed when present', () => {
    for (const card of tarotCards) {
      if (card.description !== undefined) expect(typeof card.description).toBe('string')
      if (card.numerology !== undefined) expect(typeof card.numerology).toBe('number')
      if (card.symbols !== undefined) expect(Array.isArray(card.symbols)).toBe(true)
      if (card.reflectionQuestions !== undefined) {
        expect(Array.isArray(card.reflectionQuestions)).toBe(true)
        expect(card.reflectionQuestions.length).toBe(card.reflectionQuestionsZh!.length)
      }
      if (card.affirmation !== undefined) {
        expect(typeof card.affirmation).toBe('string')
        expect(typeof card.affirmationZh).toBe('string')
      }
    }
  })

  it('ReadingRecord shape is valid', () => {
    const record: ReadingRecord = {
      date: '2024-01-01',
      spread: 'single',
      cards: [{ cardId: 0, isReversed: false, position: 'Present', positionZh: '現在' }],
    }
    expect(record.date).toBe('2024-01-01')
    expect(record.spread).toBe('single')
    expect(record.cards).toHaveLength(1)
  })

  it('DailyCardStorage shape is valid', () => {
    const storage: DailyCardStorage = {
      date: '2024-01-01',
      cardId: 5,
      isReversed: true,
    }
    expect(storage.date).toBe('2024-01-01')
    expect(storage.cardId).toBe(5)
    expect(storage.isReversed).toBe(true)
  })

  it('every card has at least 3 reflection questions when present', () => {
    for (const card of tarotCards) {
      if (card.reflectionQuestions) {
        expect(card.reflectionQuestions.length).toBeGreaterThanOrEqual(3)
      }
    }
  })
})
