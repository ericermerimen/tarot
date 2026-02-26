import { describe, it, expect } from 'vitest'
import { tarotCards, getRandomCard, getRandomCards, spreadTypes } from '@/data/tarotCards'
import type { TarotCardData, DrawnCard } from '@/types/tarot'

describe('tarotCards data', () => {
  it('contains exactly 22 Major Arcana cards', () => {
    expect(tarotCards).toHaveLength(22)
  })

  it('has sequential IDs from 0 to 21', () => {
    const ids = tarotCards.map(c => c.id)
    expect(ids).toEqual(Array.from({ length: 22 }, (_, i) => i))
  })

  it('has no duplicate IDs', () => {
    const ids = new Set(tarotCards.map(c => c.id))
    expect(ids.size).toBe(22)
  })

  it('has no duplicate names', () => {
    const names = new Set(tarotCards.map(c => c.name))
    expect(names.size).toBe(22)
  })

  it('every card has bilingual name fields', () => {
    for (const card of tarotCards) {
      expect(card.name).toBeTruthy()
      expect(card.nameZh).toBeTruthy()
      expect(card.dogBreed).toBeTruthy()
      expect(card.dogBreedZh).toBeTruthy()
    }
  })

  it('every card has upright and reversed meanings with bilingual content', () => {
    for (const card of tarotCards) {
      expect(card.upright.meaning).toBeTruthy()
      expect(card.upright.meaningZh).toBeTruthy()
      expect(card.upright.love).toBeTruthy()
      expect(card.upright.loveZh).toBeTruthy()
      expect(card.upright.career).toBeTruthy()
      expect(card.upright.careerZh).toBeTruthy()

      expect(card.reversed.meaning).toBeTruthy()
      expect(card.reversed.meaningZh).toBeTruthy()
      expect(card.reversed.love).toBeTruthy()
      expect(card.reversed.loveZh).toBeTruthy()
      expect(card.reversed.career).toBeTruthy()
      expect(card.reversed.careerZh).toBeTruthy()
    }
  })

  it('every card has keywords in both languages', () => {
    for (const card of tarotCards) {
      expect(card.keywords.length).toBeGreaterThan(0)
      expect(card.keywordsZh.length).toBeGreaterThan(0)
      expect(card.keywords.length).toBe(card.keywordsZh.length)
    }
  })

  it('every card has element and zodiac', () => {
    for (const card of tarotCards) {
      expect(card.element).toBeTruthy()
      expect(card.zodiac).toBeTruthy()
    }
  })

  it('every card has exactly 3 colors', () => {
    for (const card of tarotCards) {
      expect(card.colors).toHaveLength(3)
      for (const color of card.colors) {
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/)
      }
    }
  })
})

describe('getRandomCard', () => {
  it('returns a valid DrawnCard', () => {
    const result = getRandomCard()
    expect(result).toHaveProperty('card')
    expect(result).toHaveProperty('isReversed')
    expect(typeof result.isReversed).toBe('boolean')
    expect(tarotCards).toContain(result.card)
  })

  it('returns different cards across multiple draws', () => {
    const cards = new Set<number>()
    for (let i = 0; i < 100; i++) {
      cards.add(getRandomCard().card.id)
    }
    expect(cards.size).toBeGreaterThan(1)
  })
})

describe('getRandomCards', () => {
  it('returns the requested number of cards', () => {
    expect(getRandomCards(1)).toHaveLength(1)
    expect(getRandomCards(3)).toHaveLength(3)
    expect(getRandomCards(5)).toHaveLength(5)
    expect(getRandomCards(10)).toHaveLength(10)
  })

  it('returns no duplicate cards', () => {
    const drawn = getRandomCards(10)
    const ids = drawn.map(d => d.card.id)
    expect(new Set(ids).size).toBe(10)
  })

  it('each drawn card has isReversed boolean', () => {
    const drawn = getRandomCards(5)
    for (const d of drawn) {
      expect(typeof d.isReversed).toBe('boolean')
    }
  })
})

describe('spreadTypes', () => {
  it('has all four spread types', () => {
    expect(Object.keys(spreadTypes)).toEqual(['single', 'threeCard', 'love', 'celticCross'])
  })

  it('single spread has count 1', () => {
    expect(spreadTypes.single.count).toBe(1)
    expect(spreadTypes.single.positions).toHaveLength(1)
    expect(spreadTypes.single.positionsZh).toHaveLength(1)
  })

  it('threeCard spread has count 3', () => {
    expect(spreadTypes.threeCard.count).toBe(3)
    expect(spreadTypes.threeCard.positions).toHaveLength(3)
    expect(spreadTypes.threeCard.positionsZh).toHaveLength(3)
  })

  it('love spread has count 5', () => {
    expect(spreadTypes.love.count).toBe(5)
    expect(spreadTypes.love.positions).toHaveLength(5)
    expect(spreadTypes.love.positionsZh).toHaveLength(5)
  })

  it('celticCross spread has count 10', () => {
    expect(spreadTypes.celticCross.count).toBe(10)
    expect(spreadTypes.celticCross.positions).toHaveLength(10)
    expect(spreadTypes.celticCross.positionsZh).toHaveLength(10)
  })

  it('every spread has bilingual names and descriptions', () => {
    for (const spread of Object.values(spreadTypes)) {
      expect(spread.name).toBeTruthy()
      expect(spread.nameZh).toBeTruthy()
      expect(spread.description).toBeTruthy()
      expect(spread.descriptionZh).toBeTruthy()
    }
  })

  it('positions and positionsZh arrays match in length', () => {
    for (const spread of Object.values(spreadTypes)) {
      expect(spread.positions.length).toBe(spread.positionsZh.length)
      expect(spread.positions.length).toBe(spread.count)
    }
  })
})
