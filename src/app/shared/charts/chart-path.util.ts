/** A point in SVG coordinate space. */
export interface ChartPoint {
  readonly x: number
  readonly y: number
}

const COORDINATE_PRECISION = 100
const SMOOTHING_DIVISOR = 6

/**
 * Formats a number for use inside an SVG path string (2 decimals max,
 * no trailing noise from floating-point math).
 */
export function formatSvgCoordinate(value: number): string {
  return String(Math.round(value * COORDINATE_PRECISION) / COORDINATE_PRECISION)
}

/**
 * Builds a smoothed (Catmull-Rom -> cubic bezier) line path through points.
 * This approximates Recharts `type="monotone"` curves: tangents are derived
 * from neighbouring points so the curve stays smooth without overshooting
 * wildly on typical dashboard data.
 *
 * Falls back to straight segments for 0-2 points (no smoothing needed).
 */
export function smoothPath(points: readonly ChartPoint[]): string {
  if (points.length === 0) {
    return ''
  }
  const first = points[0]
  if (points.length === 1 && first) {
    return `M ${formatSvgCoordinate(first.x)} ${formatSvgCoordinate(first.y)}`
  }
  const second = points[1]
  if (points.length === 2 && first && second) {
    return (
      `M ${formatSvgCoordinate(first.x)} ${formatSvgCoordinate(first.y)}` +
      ` L ${formatSvgCoordinate(second.x)} ${formatSvgCoordinate(second.y)}`
    )
  }
  const lastIndex = points.length - 1
  let path = ''
  for (let index = 0; index <= lastIndex; index += 1) {
    const current = points[index]
    if (!current) {
      continue
    }
    const currentX = formatSvgCoordinate(current.x)
    const currentY = formatSvgCoordinate(current.y)
    if (index === 0) {
      path = `M ${currentX} ${currentY}`
      continue
    }
    const previous = points[index - 1]
    const beforePrevious = points[index - 2] ?? previous
    const next = points[index + 1] ?? current
    if (!previous || !beforePrevious || !next) {
      continue
    }
    const control1X =
      previous.x + (current.x - beforePrevious.x) / SMOOTHING_DIVISOR
    const control1Y =
      previous.y + (current.y - beforePrevious.y) / SMOOTHING_DIVISOR
    const control2X = current.x - (next.x - previous.x) / SMOOTHING_DIVISOR
    const control2Y = current.y - (next.y - previous.y) / SMOOTHING_DIVISOR
    path +=
      ` C ${formatSvgCoordinate(control1X)} ${formatSvgCoordinate(control1Y)}` +
      ` ${formatSvgCoordinate(control2X)} ${formatSvgCoordinate(control2Y)}` +
      ` ${currentX} ${currentY}`
  }
  return path
}

/**
 * Builds a closed area path: smoothed line through points, then straight
 * down to the baseline at both ends.
 */
export function areaPath(
  points: readonly ChartPoint[],
  baselineY: number
): string {
  if (points.length === 0) {
    return ''
  }
  const first = points[0]
  const last = points[points.length - 1]
  if (!first || !last) {
    return ''
  }
  const baseline = formatSvgCoordinate(baselineY)
  return (
    `${smoothPath(points)}` +
    ` L ${formatSvgCoordinate(last.x)} ${baseline}` +
    ` L ${formatSvgCoordinate(first.x)} ${baseline} Z`
  )
}
