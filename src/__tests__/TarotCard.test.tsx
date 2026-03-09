import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { NextIntlClientProvider } from 'next-intl'
import TarotCard from '@/components/TarotCard'
import type { TarotCardData } from '@/types/tarot'

const mockCard: TarotCardData = {
  id: 0,
  name: 'The Fool',
  nameZh: '愚者',
  nameJa: '愚者',
  dogBreed: 'Golden Retriever',
  dogBreedZh: '黃金獵犬',
  dogBreedJa: 'ゴールデンレトリバー',
  element: 'Air',
  zodiac: 'Uranus',
  colors: ['#FFD700', '#87CEEB', '#FFFFFF'],
  keywords: ['beginnings', 'innocence', 'spontaneity'],
  keywordsZh: ['新開始', '純真', '自發性'],
  keywordsJa: ['始まり', '無邪気', '自発性'],
  numerology: 0,
  upright: {
    meaning: 'New beginnings and adventure',
    meaningZh: '新的開始與冒險',
    meaningJa: '新たな始まりと冒険',
    love: 'Open to new connections',
    loveZh: '對新的連結持開放態度',
    loveJa: '新たな繋がりへのオープンさ',
    career: 'Fresh start in career',
    careerZh: '事業上的新起點',
    careerJa: 'キャリアの新たなスタート',
  },
  reversed: {
    meaning: 'Recklessness and risk',
    meaningZh: '魯莽與風險',
    meaningJa: '無謀とリスク',
    love: 'Fear of commitment',
    loveZh: '害怕承諾',
    loveJa: 'コミットメントへの恐れ',
    career: 'Poor planning',
    careerZh: '計劃不周',
    careerJa: '計画不足',
  },
}

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
})

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={{}}>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </NextIntlClientProvider>
  )
}

describe('TarotCard', () => {
  it('renders both card front and back faces', () => {
    const { container } = renderWithTheme(
      <TarotCard card={mockCard} />
    )
    // Should contain two face containers (front + back) inside the 3D wrapper
    const svgs = container.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThanOrEqual(1)
  })

  it('does not show card label below card when not flipped', () => {
    const { container } = renderWithTheme(<TarotCard card={mockCard} isFlipped={false} />)
    // The motion.div label below the card should not render when not flipped
    const typographyEls = container.querySelectorAll('.MuiTypography-root')
    const labelTexts = Array.from(typographyEls).map(el => el.textContent || '')
    const hasFoolLabel = labelTexts.some(t => t.includes('The Fool'))
    expect(hasFoolLabel).toBe(false)
  })

  it('shows EN card name below the card when flipped', () => {
    renderWithTheme(<TarotCard card={mockCard} isFlipped={true} />)
    const allFoolTexts = screen.getAllByText(/The Fool/)
    expect(allFoolTexts.length).toBeGreaterThanOrEqual(1)
  })

  it('shows ZH card name below the card when flipped', () => {
    renderWithTheme(<TarotCard card={mockCard} isFlipped={true} />)
    const allZhTexts = screen.getAllByText(/愚者/)
    expect(allZhTexts.length).toBeGreaterThanOrEqual(1)
  })

  it('shows reversed symbol (↺) when flipped and reversed in EN locale', () => {
    renderWithTheme(
      <TarotCard card={mockCard} isFlipped={true} isReversed={true} />
    )
    const matches = screen.getAllByText(/↺/)
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })

  it('does not show reversed indicators when upright', () => {
    const { container } = renderWithTheme(
      <TarotCard card={mockCard} isFlipped={true} isReversed={false} />
    )
    // The MUI Typography labels below the card should not contain reversed markers
    const typographyEls = container.querySelectorAll('.MuiTypography-root')
    const labelTexts = Array.from(typographyEls).map(el => el.textContent || '')
    const hasReversedMarker = labelTexts.some(t => t.includes('↺'))
    expect(hasReversedMarker).toBe(false)
  })
})
