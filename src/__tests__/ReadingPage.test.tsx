import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'

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

import ReadingPage from '@/app/reading/page'

const theme = createTheme({ palette: { mode: 'dark' } })

function renderPage() {
  return render(
    <ThemeProvider theme={theme}>
      <ReadingPage />
    </ThemeProvider>
  )
}

beforeEach(() => {
  localStorage.clear()
  mockGet.mockReturnValue(null)
})

describe('Reading Page', () => {
  it('renders the page title in both languages', () => {
    renderPage()
    expect(screen.getByText('Tarot Reading')).toBeInTheDocument()
    expect(screen.getByText('塔羅占卜')).toBeInTheDocument()
  })

  it('renders all four spread tabs', () => {
    renderPage()
    // MUI Tabs may render duplicate role="tab" elements in jsdom;
    // Tab labels use uppercase monospace terminal style
    const tabs = screen.getAllByRole('tab')
    const tabLabels = tabs.map(t => t.textContent)
    expect(tabLabels).toContain('SINGLE')
    expect(tabLabels).toContain('THREE_CARD')
    expect(tabLabels).toContain('LOVE')
    expect(tabLabels).toContain('CELTIC_CROSS')
  })

  it('defaults to single spread when no search param', () => {
    renderPage()
    // "Single Card" appears as the spread name in the info section
    const matches = screen.getAllByText(/Single Card/)
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })

  it('renders a "New Reading" button', () => {
    renderPage()
    // Button uses monospace terminal label: NEW_READING 重新占卜
    const buttons = screen.getAllByText(/NEW_READING/)
    expect(buttons.length).toBeGreaterThanOrEqual(1)
  })

  it('shows click-to-reveal instruction', () => {
    renderPage()
    // Instruction uses monospace terminal label: TAP_EACH_CARD_TO_REVEAL
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
