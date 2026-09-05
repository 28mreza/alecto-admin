const NICE_MULTIPLIERS = [1, 2, 2.5, 5, 10] as const
const DEFAULT_TICK_COUNT = 5
const MIN_TICK_COUNT = 2
const FLOAT_EPSILON = 1e-9
const TICK_PRECISION = 1e10

function roundTick(value: number): number {
  return Math.round(value * TICK_PRECISION) / TICK_PRECISION
}

/**
 * Builds human-friendly Y-axis ticks for a domain starting at 0.
 * Uses the "nice numbers" algorithm so ticks land on round steps
 * (1, 2, 2.5, 5 x powers of 10) instead of raw fractions of the max.
 *
 * @param max largest data value in the domain
 * @param count target number of ticks (including 0); clamped to >= 2
 * @returns ticks from 0 up to the first nice step covering `max`
 */
export function niceTicks(
  max: number,
  count: number = DEFAULT_TICK_COUNT
): number[] {
  if (!Number.isFinite(max) || max <= 0) {
    return [0]
  }
  const safeCount = Number.isFinite(count)
    ? Math.max(MIN_TICK_COUNT, Math.floor(count))
    : DEFAULT_TICK_COUNT
  const rawStep = max / (safeCount - 1)
  const magnitude = 10 ** Math.floor(Math.log10(rawStep))
  const normalized = rawStep / magnitude
  const multiplier =
    NICE_MULTIPLIERS.find(
      (candidate) => candidate + FLOAT_EPSILON >= normalized
    ) ?? 10
  const step = multiplier * magnitude
  const intervals = Math.ceil(max / step - FLOAT_EPSILON)
  const ticks: number[] = []
  for (let index = 0; index <= intervals; index += 1) {
    ticks.push(roundTick(index * step))
  }
  return ticks
}
