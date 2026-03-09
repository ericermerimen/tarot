import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { NextIntlClientProvider } from 'next-intl'
import type { DailyCardStorage } from '@/types/reading'

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

import DailyCard from '@/app/[locale]/daily/page'

const theme = createTheme({ palette: { mode: 'dark' } })

const messages = {
  daily: {
    header: 'DAILY_READING',
    tapToReveal: 'TAP_TO_REVEAL',
    tapToRevealSub: 'Tap to reveal today\'s guidance',
    drawNew: 'DRAW NEW CARD',
    upright: '> UPRIGHT',
    reversed: '> REVERSED',
    reversedLabel: '(Reversed)',
    keywords: 'KEYWORDS',
    advice: '> ADVICE',
    love: '> LOVE',
    career: '> CAREER',
    health: '> HEALTH',
    reflection: 'REFLECTION',
    affirmation: '> AFFIRMATION',
    element: 'ELEMENT',
    zodiac: 'ZODIAC',
    num: 'NUM',
  },
}

function renderPage() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ThemeProvider theme={theme}>
        <DailyCard />
      </ThemeProvider>
    </NextIntlClientProvider>
  )
}

beforeEach(() => {
  localStorage.clear()
  vi.useFakeTimers()
})

describe('Daily Card Page', () => {
  it('generates a new card and saves it to localStorage on first visit', () => {
    renderPage()

    const stored = localStorage.getItem('dailyCard')
    expect(stored).toBeTruthy()

    const parsed: DailyCardStorage = JSON.parse(stored!)
    expect(parsed.date).toBe(new Date().toDateString())
    expect(parsed.cardId).toBeGreaterThanOrEqual(0)
    expect(parsed.cardId).toBeLessThanOrEqual(21)
    expect(typeof parsed.isReversed).toBe('boolean')
  })

  it('restores a stored card if the date matches today', () => {
    const storage: DailyCardStorage = {
      date: new Date().toDateString(),
      cardId: 17,
      isReversed: false,
    }
    localStorage.setItem('dailyCard', JSON.stringify(storage))

    renderPage()

    const restored: DailyCardStorage = JSON.parse(localStorage.getItem('dailyCard')!)
    expect(restored.cardId).toBe(17)
  })

  it('generates a new card if the stored date is stale', () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const storage: DailyCardStorage = {
      date: yesterday.toDateString(),
      cardId: 5,
      isReversed: true,
    }
    localStorage.setItem('dailyCard', JSON.stringify(storage))

    renderPage()

    const restored: DailyCardStorage = JSON.parse(localStorage.getItem('dailyCard')!)
    expect(restored.date).toBe(new Date().toDateString())
  })

  it('renders the page header', () => {
    renderPage()
    const titles = screen.getAllByText(/DAILY_READING/)
    expect(titles.length).toBeGreaterThanOrEqual(1)
  })

  it('renders a tap-to-reveal prompt before flipping', () => {
    renderPage()
    const prompts = screen.getAllByText(/TAP_TO_REVEAL/)
    expect(prompts.length).toBeGreaterThanOrEqual(1)
  })
})
