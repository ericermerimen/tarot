import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CardFront, { toRomanNumeral } from '@/components/CardFront'
import type { TarotCardData } from '@/types/tarot'

const mockCard: TarotCardData = {
  id: 0,
  name: 'The Fool',
  nameZh: '愚者',
  dogBreed: 'Golden Retriever',
  dogBreedZh: '黃金獵犬',
  element: 'Air',
  zodiac: 'Uranus',
  colors: ['#FFD700', '#87CEEB', '#FFFFFF'],
  keywords: ['beginnings', 'innocence', 'spontaneity'],
  keywordsZh: ['新開始', '純真', '自發性'],
  numerology: 0,
  upright: {
    meaning: 'New beginnings',
    meaningZh: '新的開始',
    love: 'Open heart',
    loveZh: '敞開心扉',
    career: 'Fresh start',
    careerZh: '新起點',
  },
  reversed: {
    meaning: 'Recklessness',
    meaningZh: '魯莽',
    love: 'Fear',
    loveZh: '害怕',
    career: 'Poor planning',
    careerZh: '計劃不周',
  },
}

describe('toRomanNumeral', () => {
  it('converts 0 to "0"', () => {
    expect(toRomanNumeral(0)).toBe('0')
  })

  it('converts 1–21 to Roman numerals', () => {
    expect(toRomanNumeral(1)).toBe('I')
    expect(toRomanNumeral(5)).toBe('V')
    expect(toRomanNumeral(10)).toBe('X')
    expect(toRomanNumeral(14)).toBe('XIV')
    expect(toRomanNumeral(21)).toBe('XXI')
  })

  it('falls back to string for out-of-range numbers', () => {
    expect(toRomanNumeral(22)).toBe('22')
    expect(toRomanNumeral(100)).toBe('100')
  })
})

describe('CardFront', () => {
  it('renders card name in uppercase', () => {
    render(<CardFront card={mockCard} isReversed={false} width={180} height={300} />)
    expect(screen.getByText('THE FOOL')).toBeInTheDocument()
  })

  it('renders Chinese card name', () => {
    render(<CardFront card={mockCard} isReversed={false} width={180} height={300} />)
    const matches = screen.getAllByText('愚者')
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })

  it('renders roman numeral for card id', () => {
    render(<CardFront card={mockCard} isReversed={false} width={180} height={300} />)
    const matches = screen.getAllByText('0')
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })

  it('renders keywords', () => {
    render(<CardFront card={mockCard} isReversed={false} width={180} height={300} />)
    const matches = screen.getAllByText('新開始 · 純真')
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })

  it('applies rotation when reversed', () => {
    const { container } = render(
      <CardFront card={mockCard} isReversed={true} width={180} height={300} />
    )
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.style.transform).toBe('rotate(180deg)')
  })

  it('does not rotate when upright', () => {
    const { container } = render(
      <CardFront card={mockCard} isReversed={false} width={180} height={300} />
    )
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.style.transform).toBe('none')
  })

  it('renders with different card ids (illustration lookup)', () => {
    for (const id of [0, 5, 10, 15, 21]) {
      const card = { ...mockCard, id, name: `Card ${id}`, nameZh: `牌${id}` }
      const { container } = render(
        <CardFront card={card} isReversed={false} width={180} height={300} />
      )
      expect(container.firstElementChild).toBeTruthy()
    }
  })
})
