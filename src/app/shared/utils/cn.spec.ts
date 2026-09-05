import { describe, expect, it } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('merges tailwind classes, later wins', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })
  it('handles conditional and falsy values', () => {
    const falsy = false
    expect(cn('a', falsy && 'b', undefined, null, 'c')).toBe('a c')
  })
})
