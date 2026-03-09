import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { NextIntlClientProvider } from 'next-intl'

// Mock next-intl navigation
vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
  usePathname: () => '/',
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}))

import Navigation from '@/components/Navigation'

const theme = createTheme({ palette: { mode: 'dark' } })

const messages = {
  nav: {
    home: 'Home',
    daily: 'Daily Card',
    reading: 'Reading',
    gallery: 'Gallery',
    journal: 'Journal',
    brand: 'DOG_TAROT',
    light: 'LIGHT',
    dark: 'DARK',
  },
}

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ThemeProvider theme={theme}>{ui}</ThemeProvider>
    </NextIntlClientProvider>
  )
}

describe('Navigation', () => {
  it('renders the app title', () => {
    renderWithTheme(<Navigation />)
    const titles = screen.getAllByText(/DOG_TAROT/)
    expect(titles.length).toBeGreaterThanOrEqual(1)
  })

  it('renders all navigation items', () => {
    renderWithTheme(<Navigation />)
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

  it('renders locale switcher buttons', () => {
    renderWithTheme(<Navigation />)
    expect(screen.getAllByText('EN').length).toBeGreaterThanOrEqual(1)
  })
})
