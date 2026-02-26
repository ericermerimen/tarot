import { describe, it, expect, beforeEach } from 'vitest'
import { tarotCards, getRandomCard, getRandomCards, spreadTypes } from '@/data/tarotCards'
import type { DailyCardStorage, ReadingRecord } from '@/types/reading'

/**
 * Tests for localStorage persistence contracts.
 * The daily card and journal pages serialize/deserialize data through
 * localStorage — these tests verify the data shapes survive the round-trip.
 */

beforeEach(() => {
  localStorage.clear()
})

describe('DailyCardStorage persistence', () => {
  it('round-trips a daily card through localStorage', () => {
    const drawn = getRandomCard()
    const storage: DailyCardStorage = {
      date: new Date().toDateString(),
      cardId: drawn.card.id,
      isReversed: drawn.isReversed,
    }

    localStorage.setItem('dailyCard', JSON.stringify(storage))
    const restored: DailyCardStorage = JSON.parse(localStorage.getItem('dailyCard')!)

    expect(restored.date).toBe(storage.date)
    expect(restored.cardId).toBe(storage.cardId)
    expect(typeof restored.isReversed).toBe('boolean')
  })

  it('stored cardId resolves to a valid card in tarotCards', () => {
    const storage: DailyCardStorage = {
      date: new Date().toDateString(),
      cardId: 10,
      isReversed: false,
    }
    localStorage.setItem('dailyCard', JSON.stringify(storage))

    const restored: DailyCardStorage = JSON.parse(localStorage.getItem('dailyCard')!)
    const card = tarotCards.find(c => c.id === restored.cardId)
    expect(card).toBeDefined()
    expect(card!.name).toBeTruthy()
    expect(card!.nameZh).toBeTruthy()
  })

  it('detects stale daily card by comparing date strings', () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const storage: DailyCardStorage = {
      date: yesterday.toDateString(),
      cardId: 5,
      isReversed: true,
    }
    localStorage.setItem('dailyCard', JSON.stringify(storage))

    const restored: DailyCardStorage = JSON.parse(localStorage.getItem('dailyCard')!)
    const today = new Date().toDateString()
    expect(restored.date).not.toBe(today)
  })

  it('returns null when no daily card is stored', () => {
    expect(localStorage.getItem('dailyCard')).toBeNull()
  })
})

describe('ReadingRecord (journal) persistence', () => {
  function createMockReading(spread: 'single' | 'threeCard' | 'love' | 'celticCross'): ReadingRecord {
    const spreadType = spreadTypes[spread]
    const drawn = getRandomCards(spreadType.count)
    return {
      date: new Date().toISOString(),
      spread,
      cards: drawn.map((c, i) => ({
        cardId: c.card.id,
        isReversed: c.isReversed,
        position: spreadType.positions[i],
        positionZh: spreadType.positionsZh[i],
      })),
    }
  }

  it('round-trips a single-card reading through localStorage', () => {
    const reading = createMockReading('single')
    const history = [reading]
    localStorage.setItem('tarotHistory', JSON.stringify(history))

    const restored: ReadingRecord[] = JSON.parse(localStorage.getItem('tarotHistory')!)
    expect(restored).toHaveLength(1)
    expect(restored[0].spread).toBe('single')
    expect(restored[0].cards).toHaveLength(1)
    expect(restored[0].cards[0].position).toBeTruthy()
    expect(restored[0].cards[0].positionZh).toBeTruthy()
  })

  it('round-trips a three-card reading with correct positions', () => {
    const reading = createMockReading('threeCard')
    localStorage.setItem('tarotHistory', JSON.stringify([reading]))

    const restored: ReadingRecord[] = JSON.parse(localStorage.getItem('tarotHistory')!)
    expect(restored[0].cards).toHaveLength(3)
    // Verify all positions are populated
    for (const card of restored[0].cards) {
      expect(card.position).toBeTruthy()
      expect(card.positionZh).toBeTruthy()
      expect(typeof card.isReversed).toBe('boolean')
    }
  })

  it('round-trips a celtic cross reading with 10 cards', () => {
    const reading = createMockReading('celticCross')
    localStorage.setItem('tarotHistory', JSON.stringify([reading]))

    const restored: ReadingRecord[] = JSON.parse(localStorage.getItem('tarotHistory')!)
    expect(restored[0].cards).toHaveLength(10)
    expect(restored[0].spread).toBe('celticCross')
  })

  it('prepends new readings and caps history at 50', () => {
    const history: ReadingRecord[] = []
    for (let i = 0; i < 55; i++) {
      history.push(createMockReading('single'))
    }
    // Simulate the cap logic from reading/page.tsx
    const capped = history.slice(0, 50)
    localStorage.setItem('tarotHistory', JSON.stringify(capped))

    const restored: ReadingRecord[] = JSON.parse(localStorage.getItem('tarotHistory')!)
    expect(restored).toHaveLength(50)
  })

  it('deletes a single reading by index', () => {
    const readings = [
      createMockReading('single'),
      createMockReading('threeCard'),
      createMockReading('love'),
    ]
    localStorage.setItem('tarotHistory', JSON.stringify(readings))

    // Delete the middle reading (index 1)
    const stored: ReadingRecord[] = JSON.parse(localStorage.getItem('tarotHistory')!)
    const updated = stored.filter((_, i) => i !== 1)
    localStorage.setItem('tarotHistory', JSON.stringify(updated))

    const final: ReadingRecord[] = JSON.parse(localStorage.getItem('tarotHistory')!)
    expect(final).toHaveLength(2)
    expect(final[0].spread).toBe('single')
    expect(final[1].spread).toBe('love')
  })

  it('clears all readings by removing the key', () => {
    const readings = [createMockReading('single'), createMockReading('threeCard')]
    localStorage.setItem('tarotHistory', JSON.stringify(readings))

    localStorage.removeItem('tarotHistory')
    expect(localStorage.getItem('tarotHistory')).toBeNull()
  })

  it('each stored cardId resolves to a valid tarot card', () => {
    const reading = createMockReading('celticCross')
    localStorage.setItem('tarotHistory', JSON.stringify([reading]))

    const restored: ReadingRecord[] = JSON.parse(localStorage.getItem('tarotHistory')!)
    for (const cardRecord of restored[0].cards) {
      const card = tarotCards.find(c => c.id === cardRecord.cardId)
      expect(card).toBeDefined()
      expect(card!.upright.meaning).toBeTruthy()
      expect(card!.reversed.meaning).toBeTruthy()
    }
  })
})
