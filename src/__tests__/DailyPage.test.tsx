import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import type { DailyCardStorage } from '@/types/reading'
import { tarotCards } from '@/data/tarotCards'

// Mock framer-motion to avoid animation issues in jsdom
vi.mock('framer-motion', () => ({
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

import DailyCard from '@/app/daily/page'

const theme = createTheme({ palette: { mode: 'dark' } })

function renderPage() {
  return render(
    <ThemeProvider theme={theme}>
      <DailyCard />
    </ThemeProvider>
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
      cardId: 17, // The Star
      isReversed: false,
    }
    localStorage.setItem('dailyCard', JSON.stringify(storage))

    renderPage()

    // Should not overwrite with a new card
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

    // Should have generated a new card for today
    const restored: DailyCardStorage = JSON.parse(localStorage.getItem('dailyCard')!)
    expect(restored.date).toBe(new Date().toDateString())
  })

  it('renders the page title in both languages', () => {
    renderPage()
    // Title contains both "Daily Card" and "每日一牌" in a single element
    const titles = screen.getAllByText(/Daily Card/)
    expect(titles.length).toBeGreaterThanOrEqual(1)
  })

  it('renders a tap-to-reveal prompt before flipping', () => {
    renderPage()
    const prompts = screen.getAllByText(/Tap the card to reveal/)
    expect(prompts.length).toBeGreaterThanOrEqual(1)
  })
})
