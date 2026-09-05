const PERCENT_SCALE = 100

/**
 * Computes the CSS width of a SimpleBarList bar relative to the list max.
 * Rounded to whole percents to match the React source
 * (`Math.round((value / max) * 100)`).
 *
 * @param value bar value (clamped into 0..max)
 * @param max largest value in the list; non-positive/NaN yields '0%'
 */
export function barWidth(value: number, max: number): string {
  if (!Number.isFinite(value) || !Number.isFinite(max) || max <= 0) {
    return '0%'
  }
  const clamped = Math.min(Math.max(value, 0), max)
  return `${Math.round((clamped / max) * PERCENT_SCALE)}%`
}
