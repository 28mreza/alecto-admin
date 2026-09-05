import { describe, expect, it } from 'vitest'
import { areaPath, smoothPath } from './chart-path.util'

describe('smoothPath', () => {
  it('returns an empty string for no points', () => {
    expect(smoothPath([])).toBe('')
  })

  it('moves to the single point without a line segment', () => {
    expect(smoothPath([{ x: 10, y: 20 }])).toBe('M 10 20')
  })

  it('joins two points with a straight segment', () => {
    const path = smoothPath([
      { x: 0, y: 5 },
      { x: 10, y: 15 },
    ])
    expect(path).toContain('M 0 5')
    expect(path).toContain('L 10 15')
    expect(path).not.toContain('C')
  })

  it('smooths three or more points with cubic segments', () => {
    const path = smoothPath([
      { x: 0, y: 10 },
      { x: 10, y: 0 },
      { x: 20, y: 10 },
      { x: 30, y: 5 },
    ])
    expect(path.startsWith('M 0 10')).toBe(true)
    expect(path).toContain('C')
    expect(path).toContain('30 5')
    expect(path).not.toMatch(/NaN|Infinity/)
  })

  it('keeps x coordinates increasing for increasing input x', () => {
    const path = smoothPath([
      { x: 0, y: 8 },
      { x: 5, y: 2 },
      { x: 10, y: 9 },
      { x: 15, y: 4 },
      { x: 20, y: 7 },
    ])
    const numbers = path.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? []
    const xs = numbers.filter((_, index) => index % 2 === 0)
    const anchors = [xs[0], xs[xs.length - 3], xs[xs.length - 1]]
    const sorted = [...anchors].sort((a, b) => (a ?? 0) - (b ?? 0))
    expect(anchors).toEqual(sorted)
  })
})

describe('areaPath', () => {
  it('returns an empty string for no points', () => {
    expect(areaPath([], 100)).toBe('')
  })

  it('closes the smoothed line down to the baseline', () => {
    const path = areaPath(
      [
        { x: 0, y: 10 },
        { x: 10, y: 0 },
        { x: 20, y: 10 },
      ],
      50
    )
    expect(path.startsWith('M 0 10')).toBe(true)
    expect(path.endsWith('Z')).toBe(true)
    expect(path).toContain('L 20 50')
    expect(path).toContain('L 0 50')
  })
})
