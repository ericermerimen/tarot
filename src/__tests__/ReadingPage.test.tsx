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
  useParams: () => ({
    spread: 'single',
  }),
}))

// Mock next-intl navigation
vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
  usePathname: () => '/reading',
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
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

import ReadingIndexPage from '@/app/[locale]/reading/page'
import SpreadReadingPage from '@/app/[locale]/reading/[spread]/page'

const theme = createTheme({ palette: { mode: 'dark' } })

const messages = {
  reading: {
    header: 'TAROT_READING',
    title: 'Tarot Reading',
    subtitle: 'Choose a Spread',
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
    spreadNotFound: 'Spread not found',
    backToSpreads: '← Back to spreads',
  },
}

function renderIndexPage() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ThemeProvider theme={theme}>
        <ReadingIndexPage />
      </ThemeProvider>
    </NextIntlClientProvider>
  )
}

function renderSpreadPage() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ThemeProvider theme={theme}>
        <SpreadReadingPage />
      </ThemeProvider>
    </NextIntlClientProvider>
  )
}

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  mockGet.mockReturnValue(null)
})

describe('Reading Index Page', () => {
  it('renders the page title', () => {
    renderIndexPage()
    expect(screen.getByText('Tarot Reading')).toBeInTheDocument()
    expect(screen.getByText('Choose a Spread')).toBeInTheDocument()
  })

  it('renders all four spread options as links', () => {
    renderIndexPage()
    const links = screen.getAllByRole('link')
    const hrefs = links.map(l => l.getAttribute('href'))
    expect(hrefs).toContain('/reading/single')
    expect(hrefs).toContain('/reading/three-card')
    expect(hrefs).toContain('/reading/love')
    expect(hrefs).toContain('/reading/celtic-cross')
  })
})

describe('Spread Reading Page', () => {
  it('renders the single card spread with intention phase', () => {
    renderSpreadPage()
    expect(screen.getAllByText(/Single Card/i).length).toBeGreaterThanOrEqual(1)
  })

  it('shows intention phase with Draw Cards button', () => {
    renderSpreadPage()
    expect(screen.getAllByText(/SET_YOUR_INTENTION/).length).toBeGreaterThanOrEqual(1)
    const buttons = screen.getAllByText(/DRAW_THE_CARDS/)
    expect(buttons.length).toBeGreaterThanOrEqual(1)
  })

  it('shows intention tags for focus areas', () => {
    renderSpreadPage()
    expect(screen.getAllByText('GENERAL').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('CAREER').length).toBeGreaterThanOrEqual(1)
  })

  it('shows spread navigation chips', () => {
    renderSpreadPage()
    // The current spread (single) should be shown as active
    expect(screen.getAllByText('SINGLE').length).toBeGreaterThanOrEqual(1)
    // Other spreads should be shown as navigation links
    expect(screen.getAllByText('THREE_CARD').length).toBeGreaterThanOrEqual(1)
  })
})
