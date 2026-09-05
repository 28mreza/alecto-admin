import { describe, expect, it } from 'vitest'
import { niceTicks } from './chart-axis.util'

describe('niceTicks', () => {
  it('returns [0] for zero, negative, or non-finite max', () => {
    expect(niceTicks(0)).toEqual([0])
    expect(niceTicks(-50)).toEqual([0])
    expect(niceTicks(Number.NaN)).toEqual([0])
    expect(niceTicks(Number.POSITIVE_INFINITY)).toEqual([0])
  })

  it('produces round ticks covering a dashboard-scale max', () => {
    expect(niceTicks(6000, 5)).toEqual([0, 2000, 4000, 6000])
  })

  it('produces exact fractional-nice ticks for small max values', () => {
    expect(niceTicks(100, 5)).toEqual([0, 25, 50, 75, 100])
  })

  it('always starts at 0, stays evenly spaced, and covers the max', () => {
    for (const max of [1, 7, 512, 1248, 9999]) {
      const ticks = niceTicks(max, 5)
      expect(ticks[0]).toBe(0)
      expect(ticks[ticks.length - 1]).toBeGreaterThanOrEqual(max)
      const steps = ticks
        .slice(1)
        .map((tick, index) => tick - (ticks[index] ?? 0))
      const uniqueSteps = new Set(steps)
      expect(uniqueSteps.size).toBe(1)
    }
  })

  it('clamps tiny tick counts to a minimum of two ticks', () => {
    expect(niceTicks(100, 1)).toEqual([0, 100])
  })
})
