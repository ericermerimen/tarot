import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { NextIntlClientProvider } from 'next-intl'

// Mock next/navigation
const mockGet = vi.fn().mockReturnValue(null)
vi.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: mockGet,
  }),
}))

// Mock motion/react to avoid animation issues in jsdom
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...filterDomProps(props)}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}))

// Mock the shader canvas (WebGL not available in jsdom)
vi.mock('@/components/shaders/CardShaderCanvas', () => ({
  default: () => <canvas data-testid="shader-canvas" />,
}))

function filterDomProps(props: Record<string, unknown>) {
  const domProps: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(props)) {
    if (['className', 'style', 'onClick', 'children', 'id', 'role'].includes(key)) {
      domProps[key] = value
    }
  }
  return domProps
}

import ReadingPage from '@/app/[locale]/reading/page'

const theme = createTheme({ palette: { mode: 'dark' } })

const messages = {
  reading: {
    header: 'TAROT_READING',
    title: 'Tarot Reading',
    subtitle: 'Tarot Divination',
    tapEachCard: 'TAP_EACH_CARD_TO_REVEAL',
    loading: 'LOADING...',
    single: 'SINGLE',
    threeCard: 'THREE_CARD',
    love: 'LOVE',
    celticCross: 'CELTIC_CROSS',
    crossingCard: 'CROSSING_CARD',
    newReading: 'NEW_READING',
    saveToJournal: 'SAVE_TO_JOURNAL',
    saved: 'SAVED ✓',
    intentPrompt: 'INTENT > WHAT ARE YOU ASKING ABOUT?',
    general: 'GENERAL',
    career: 'CAREER',
    loveCat: 'LOVE',
    self: 'SELF',
    finance: 'FINANCE',
    health: 'HEALTH',
    optionalContext: 'Optional context...',
    confirmSave: 'CONFIRM_SAVE →',
    skip: 'SKIP',
    upright: '> UPRIGHT',
    reversed: '> REVERSED',
    reversedLabel: '(Reversed)',
    keywords: 'KEYWORDS',
    cardBreakdown: 'CARD_BREAKDOWN',
    cards: 'CARDS',
    intentPhaseTitle: 'SET_YOUR_INTENTION',
    intentPhaseDesc: 'Take a breath.',
    intentNotePlaceholder: 'What is your question?',
    drawCards: 'DRAW_THE_CARDS',
    yourQuestion: 'YOUR_QUESTION',
    dailyCardEcho: 'Your daily card {cardName} echoes here in the {position} position',
    affirmation: '> AFFIRMATION',
    copyReading: 'COPY_READING',
    copied: 'COPIED',
    keyTakeaway: 'KEY_TAKEAWAY',
    reflectOn: 'REFLECT_ON_THIS',
    goDeeper: 'GO_DEEPER',
    tryThreeCard: 'Try Three Card',
    tryLove: 'Try Love',
    tryCelticCross: 'Try Celtic Cross',
    trySingle: 'Try Single',
    tryDaily: 'Try Daily',
    viewJournal: 'View Journal',
    sectionLove: 'LOVE',
    sectionAdvice: 'ADVICE',
    sectionHealth: 'HEALTH',
  },
}

function renderPage() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ThemeProvider theme={theme}>
        <ReadingPage />
      </ThemeProvider>
    </NextIntlClientProvider>
  )
}

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  mockGet.mockReturnValue(null)
})

describe('Reading Page', () => {
  it('renders the page title', () => {
    renderPage()
    expect(screen.getByText('Tarot Reading')).toBeInTheDocument()
    expect(screen.getByText('Tarot Divination')).toBeInTheDocument()
  })

  it('renders all four spread tabs', () => {
    renderPage()
    const tabs = screen.getAllByRole('tab')
    const tabTexts = tabs.map(t => t.textContent)
    expect(tabTexts).toContain('SINGLE')
    expect(tabTexts).toContain('THREE_CARD')
    // LOVE also appears as an intention tag; check it exists among actual MUI tabs
    expect(tabTexts.filter(t => t === 'LOVE').length).toBeGreaterThanOrEqual(1)
    expect(tabTexts).toContain('CELTIC_CROSS')
  })

  it('defaults to single spread when no search param', () => {
    renderPage()
    const matches = screen.getAllByText(/Single Card/)
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })

  it('shows intention phase with Draw Cards button', () => {
    renderPage()
    expect(screen.getAllByText(/SET_YOUR_INTENTION/).length).toBeGreaterThanOrEqual(1)
    const buttons = screen.getAllByText(/DRAW_THE_CARDS/)
    expect(buttons.length).toBeGreaterThanOrEqual(1)
  })

  it('shows intention tags for focus areas', () => {
    renderPage()
    expect(screen.getAllByText('GENERAL').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('CAREER').length).toBeGreaterThanOrEqual(1)
  })

  it('respects spread search param for three-card', () => {
    mockGet.mockReturnValue('threeCard')
    renderPage()
    const matches = screen.getAllByText(/Three Card Spread/i)
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })
})
