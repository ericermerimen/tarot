import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import TarotCard from '@/components/TarotCard'
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
    meaning: 'New beginnings and adventure',
    meaningZh: '新的開始與冒險',
    love: 'Open to new connections',
    loveZh: '對新的連結持開放態度',
    career: 'Fresh start in career',
    careerZh: '事業上的新起點',
  },
  reversed: {
    meaning: 'Recklessness and risk',
    meaningZh: '魯莽與風險',
    love: 'Fear of commitment',
    loveZh: '害怕承諾',
    career: 'Poor planning',
    careerZh: '計劃不周',
  },
}

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
})

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
}

describe('TarotCard', () => {
  it('renders without crashing', () => {
    const { container } = renderWithTheme(
      <TarotCard card={mockCard} />
    )
    expect(container).toBeTruthy()
  })

  it('does not show card name label when not flipped', () => {
    renderWithTheme(<TarotCard card={mockCard} isFlipped={false} />)
    // The card name Typography only appears when flipped
    // (CardFront SVG also renders the name, so we check for absence of the MUI label)
    const allFoolTexts = screen.queryAllByText(/The Fool/)
    // When not flipped, The Fool should not appear (only card back is visible)
    expect(allFoolTexts.length).toBe(0)
  })

  it('shows card name when flipped', () => {
    renderWithTheme(<TarotCard card={mockCard} isFlipped={true} />)
    // Card name appears in both SVG and Typography label
    const allFoolTexts = screen.getAllByText(/The Fool/)
    expect(allFoolTexts.length).toBeGreaterThanOrEqual(1)
  })

  it('shows Chinese name when flipped', () => {
    renderWithTheme(<TarotCard card={mockCard} isFlipped={true} />)
    // Chinese name appears in both CardFront SVG and Typography label
    const allZhTexts = screen.getAllByText(/愚者/)
    expect(allZhTexts.length).toBeGreaterThanOrEqual(1)
  })

  it('shows reversed indicator when flipped and reversed', () => {
    renderWithTheme(
      <TarotCard card={mockCard} isFlipped={true} isReversed={true} />
    )
    expect(screen.getByText(/逆位/)).toBeInTheDocument()
  })
})
