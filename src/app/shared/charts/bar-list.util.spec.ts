import { describe, expect, it } from 'vitest'
import { barWidth } from './bar-list.util'

describe('barWidth', () => {
  it('returns 0% for a zero value', () => {
    expect(barWidth(0, 512)).toBe('0%')
  })

  it('returns 50% for half of the max', () => {
    expect(barWidth(256, 512)).toBe('50%')
  })

  it('returns 100% for the max value', () => {
    expect(barWidth(512, 512)).toBe('100%')
  })

  it('guards against zero, negative, or non-finite max', () => {
    expect(barWidth(10, 0)).toBe('0%')
    expect(barWidth(10, -5)).toBe('0%')
    expect(barWidth(10, Number.NaN)).toBe('0%')
  })

  it('clamps out-of-range values and rounds to whole percents', () => {
    expect(barWidth(-20, 100)).toBe('0%')
    expect(barWidth(200, 100)).toBe('100%')
    expect(barWidth(1, 3)).toBe('33%')
  })
})
