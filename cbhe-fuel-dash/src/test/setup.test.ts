import { describe, it, expect } from 'vitest'

describe('test infrastructure', () => {
  it('runs vitest correctly', () => {
    expect(true).toBe(true)
  })

  it('supports TypeScript assertions', () => {
    const sum = (a: number, b: number): number => a + b
    expect(sum(2, 3)).toBe(5)
  })
})
