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
    const tabLabels = tabs.map(t => t.textContent)
    expect(tabLabels).toContain('SINGLE')
    expect(tabLabels).toContain('THREE_CARD')
    expect(tabLabels).toContain('LOVE')
    expect(tabLabels).toContain('CELTIC_CROSS')
  })

  it('defaults to single spread when no search param', () => {
    renderPage()
    const matches = screen.getAllByText(/Single Card/)
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })

  it('renders a "New Reading" button', () => {
    renderPage()
    const buttons = screen.getAllByText(/NEW_READING/)
    expect(buttons.length).toBeGreaterThanOrEqual(1)
  })

  it('shows click-to-reveal instruction', () => {
    renderPage()
    const instructions = screen.getAllByText(/TAP_EACH_CARD_TO_REVEAL/)
    expect(instructions.length).toBeGreaterThanOrEqual(1)
  })

  it('respects spread search param for three-card', () => {
    mockGet.mockReturnValue('threeCard')
    renderPage()
    const matches = screen.getAllByText(/Three Card Spread/i)
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })
})
