import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import CardBack from '@/components/CardBack'

describe('CardBack', () => {
  it('renders an image with the card-base src', () => {
    const { container } = render(<CardBack width={180} height={300} />)
    const img = container.querySelector('img')
    expect(img).toBeTruthy()
    expect(img?.getAttribute('src')).toContain('card-base')
  })

  it('applies width and height to the wrapper', () => {
    const { container } = render(<CardBack width={240} height={400} />)
    const wrapper = container.firstElementChild as HTMLElement
    expect(wrapper.style.width).toBe('240px')
    expect(wrapper.style.height).toBe('400px')
  })
})
