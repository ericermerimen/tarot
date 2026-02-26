import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import CardBack from '@/components/CardBack'

describe('CardBack', () => {
  it('renders SVG overlay with correct viewBox matching default dimensions', () => {
    const { container } = render(<CardBack width={180} height={300} />)
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
    expect(svg?.getAttribute('viewBox')).toBe('0 0 180 300')
  })

  it('respects width and height props on SVG and wrapper', () => {
    const { container } = render(<CardBack width={240} height={400} />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('width')).toBe('240')
    expect(svg?.getAttribute('height')).toBe('400')

    // Wrapper div should match the provided dimensions
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.style.width).toBe('240px')
    expect(wrapper.style.height).toBe('400px')
  })

  it('renders the DOG TAROT branding text with serif font', () => {
    const { container } = render(<CardBack width={180} height={300} />)
    const allText = Array.from(container.querySelectorAll('text'))
    const dogTarotEl = allText.find((el) => el.textContent?.trim() === 'DOG TAROT')
    expect(dogTarotEl).toBeTruthy()
    // jsdom lowercases SVG presentational attributes
    const fontAttr = dogTarotEl?.getAttribute('font-family') ?? dogTarotEl?.getAttribute('fontFamily')
    expect(fontAttr).toContain('Cinzel')
  })

  it('contains decorative SVG elements (borders, circles, stars)', () => {
    const { container } = render(<CardBack width={180} height={300} />)
    // Outer border rect
    const rects = container.querySelectorAll('rect')
    expect(rects.length).toBeGreaterThanOrEqual(2)

    // Central circle motif
    const circles = container.querySelectorAll('circle')
    expect(circles.length).toBeGreaterThanOrEqual(4)

    // Star/crown polygons at bottom
    const polygons = container.querySelectorAll('polygon')
    expect(polygons.length).toBe(3)
  })

  it('defines gradient and filter defs for visual effects', () => {
    const { container } = render(<CardBack width={180} height={300} />)
    // jsdom lowercases SVG element names, so query by [id] attribute instead
    const defs = container.querySelector('defs')
    expect(defs).toBeTruthy()
    const ids = Array.from(defs!.querySelectorAll('[id]')).map(el => el.getAttribute('id'))
    expect(ids).toContain('cbGold')
    expect(ids).toContain('cbPurple')
    expect(ids).toContain('cbGlow')
  })
})
