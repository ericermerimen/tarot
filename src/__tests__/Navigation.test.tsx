import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

import Navigation from '@/components/Navigation'

const theme = createTheme({ palette: { mode: 'dark' } })

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
}

describe('Navigation', () => {
  it('renders the app title', () => {
    renderWithTheme(<Navigation />)
    expect(screen.getByText(/Mystical Dog Tarot/)).toBeInTheDocument()
  })

  it('renders all navigation items', () => {
    renderWithTheme(<Navigation />)
    // Each nav item appears in both desktop toolbar and mobile drawer
    expect(screen.getAllByText('Home').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Daily Card').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Reading').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Gallery').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Journal').length).toBeGreaterThanOrEqual(1)
  })

  it('renders menu button for mobile', () => {
    renderWithTheme(<Navigation />)
    const menuButtons = screen.getAllByLabelText('menu')
    expect(menuButtons.length).toBeGreaterThanOrEqual(1)
  })

  it('renders navigation links with correct hrefs', () => {
    renderWithTheme(<Navigation />)
    const links = screen.getAllByRole('link')
    const hrefs = links.map((link) => link.getAttribute('href'))
    expect(hrefs).toContain('/')
    expect(hrefs).toContain('/daily')
    expect(hrefs).toContain('/reading')
    expect(hrefs).toContain('/gallery')
    expect(hrefs).toContain('/journal')
  })
})
