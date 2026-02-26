import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CardBack from '@/components/CardBack'

describe('CardBack', () => {
  it('renders without crashing', () => {
    const { container } = render(<CardBack width={180} height={300} />)
    expect(container).toBeTruthy()
  })

  it('renders the DOG TAROT text', () => {
    const { container } = render(<CardBack width={180} height={300} />)
    const textEl = container.querySelector('text')
    const allText = Array.from(container.querySelectorAll('text'))
    const dogTarotEl = allText.find((el) => el.textContent?.trim() === 'DOG TAROT')
    expect(dogTarotEl).toBeTruthy()
  })

  it('renders SVG elements with correct viewBox', () => {
    const { container } = render(<CardBack width={180} height={300} />)
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
    expect(svg?.getAttribute('viewBox')).toBe('0 0 180 300')
  })

  it('respects width and height props', () => {
    const { container } = render(<CardBack width={240} height={400} />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('width')).toBe('240')
    expect(svg?.getAttribute('height')).toBe('400')
  })
})
