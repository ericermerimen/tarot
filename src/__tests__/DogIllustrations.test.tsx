import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { DogIllustrations, GenericDog } from '@/components/cards'

describe('DogIllustrations', () => {
  it('has exactly 22 illustration entries (0–21)', () => {
    expect(Object.keys(DogIllustrations)).toHaveLength(22)
    for (let id = 0; id <= 21; id++) {
      expect(DogIllustrations[id]).toBeDefined()
    }
  })

  it('each illustration renders inside an SVG <g> element', () => {
    for (let id = 0; id <= 21; id++) {
      const Component = DogIllustrations[id]
      const { container } = render(
        <svg>
          <Component />
        </svg>
      )
      const gElements = container.querySelectorAll('g')
      expect(gElements.length).toBeGreaterThan(0)
    }
  })

  it('GenericDog accepts primaryColor prop', () => {
    const { container } = render(
      <svg>
        <GenericDog primaryColor="#FF0000" />
      </svg>
    )
    const fills = Array.from(container.querySelectorAll('[fill="#FF0000"]'))
    expect(fills.length).toBeGreaterThan(0)
  })

  it('GenericDog uses fallback color without primaryColor', () => {
    const { container } = render(
      <svg>
        <GenericDog />
      </svg>
    )
    const fills = Array.from(container.querySelectorAll('[fill="#FFD700"]'))
    expect(fills.length).toBeGreaterThan(0)
  })
})
