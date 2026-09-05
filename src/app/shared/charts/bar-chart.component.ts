import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core'
import { niceTicks } from './chart-axis.util'
import { formatSvgCoordinate } from './chart-path.util'

export interface BarChartDatum {
  readonly name: string
  readonly value: number
}

interface BarGeometry {
  readonly name: string
  readonly value: number
  readonly height: number
  readonly d: string
}

interface TickRow {
  readonly value: number
  readonly label: string
  readonly y: number
}

interface CategoryLabel {
  readonly name: string
  readonly x: number
}

const VIEW_BOX_WIDTH = 600
const MARGIN_TOP = 8
const MARGIN_RIGHT = 8
const MARGIN_BOTTOM = 28
const MARGIN_LEFT = 48
/** Share of each category band occupied by the bar (~30% gap, Recharts-like). */
const BAR_WIDTH_RATIO = 0.7
const BAR_CORNER_RADIUS = 4
const TICK_TARGET_COUNT = 5
const X_LABEL_OFFSET_Y = 18
const Y_LABEL_OFFSET_X = 8
const Y_LABEL_OFFSET_Y = 4
const TICK_FILL = '#888888'
const TICK_FONT_SIZE = 12

/**
 * Builds a bar path with rounded TOP corners only (radius [4,4,0,0],
 * matching the Recharts source). A plain `rx` would round the bottom
 * corners too, so the top arc is drawn explicitly with quadratic segments
 * and the base stays square.
 */
export function roundedTopBarPath(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): string {
  if (width <= 0 || height <= 0) {
    return ''
  }
  const corner = Math.min(Math.max(radius, 0), width / 2, height)
  const left = formatSvgCoordinate(x)
  const right = formatSvgCoordinate(x + width)
  const top = formatSvgCoordinate(y)
  const base = formatSvgCoordinate(y + height)
  if (corner <= 0) {
    return `M ${left} ${base} L ${left} ${top} L ${right} ${top} L ${right} ${base} Z`
  }
  const innerLeft = formatSvgCoordinate(x + corner)
  const innerRight = formatSvgCoordinate(x + width - corner)
  const arcTop = formatSvgCoordinate(y + corner)
  return (
    `M ${left} ${base}` +
    ` L ${left} ${arcTop}` +
    ` Q ${left} ${top} ${innerLeft} ${top}` +
    ` L ${innerRight} ${top}` +
    ` Q ${right} ${top} ${right} ${arcTop}` +
    ` L ${right} ${base} Z`
  )
}

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      width="100%"
      [attr.height]="height()"
      [attr.viewBox]="viewBox()"
      role="img"
      [attr.aria-label]="ariaLabel()"
    >
      @for (tick of tickRows(); track tick.value) {
        <text
          data-y-label
          [attr.x]="marginLeft - yLabelOffsetX"
          [attr.y]="tick.y + yLabelOffsetY"
          text-anchor="end"
          [attr.font-size]="tickFontSize"
          [attr.fill]="tickFill"
        >
          {{ tick.label }}
        </text>
      }
      @for (label of categoryLabels(); track label.name) {
        <text
          data-x-label
          [attr.x]="label.x"
          [attr.y]="xLabelY()"
          text-anchor="middle"
          [attr.font-size]="tickFontSize"
          [attr.fill]="tickFill"
        >
          {{ label.name }}
        </text>
      }
      @for (bar of bars(); track bar.name) {
        @if (bar.d !== '') {
          <path
            data-bar
            [attr.d]="bar.d"
            fill="currentColor"
            class="text-primary fill-primary"
          >
            <title>{{ bar.name }}: {{ yPrefix() }}{{ bar.value }}</title>
          </path>
        }
      }
    </svg>
  `,
})
export class BarChartComponent {
  readonly data = input<BarChartDatum[]>([])
  readonly height = input(350)
  readonly yPrefix = input('$')

  protected readonly tickFill = TICK_FILL
  protected readonly tickFontSize = TICK_FONT_SIZE
  protected readonly marginLeft = MARGIN_LEFT
  protected readonly yLabelOffsetX = Y_LABEL_OFFSET_X
  protected readonly yLabelOffsetY = Y_LABEL_OFFSET_Y

  private readonly plotWidth = computed(
    () => VIEW_BOX_WIDTH - MARGIN_LEFT - MARGIN_RIGHT
  )
  private readonly plotHeight = computed(
    () => this.height() - MARGIN_TOP - MARGIN_BOTTOM
  )
  private readonly baselineY = computed(() => MARGIN_TOP + this.plotHeight())
  private readonly maxValue = computed(() =>
    this.data().reduce((max, datum) => Math.max(max, datum.value), 0)
  )
  private readonly ticks = computed(() =>
    niceTicks(this.maxValue(), TICK_TARGET_COUNT)
  )
  private readonly domainMax = computed(() => {
    const ticks = this.ticks()
    const top = ticks[ticks.length - 1] ?? 0
    return top > 0 ? top : 1
  })

  protected readonly viewBox = computed(
    () => `0 0 ${VIEW_BOX_WIDTH} ${this.height()}`
  )
  protected readonly ariaLabel = computed(() =>
    this.data().length === 0 ? 'Bar chart with no data' : 'Bar chart'
  )
  protected readonly xLabelY = computed(
    () => this.baselineY() + X_LABEL_OFFSET_Y
  )

  protected readonly tickRows = computed<TickRow[]>(() =>
    this.ticks().map((value) => ({
      value,
      label: `${this.yPrefix()}${value}`,
      y: this.yForValue(value),
    }))
  )

  protected readonly categoryLabels = computed<CategoryLabel[]>(() => {
    const data = this.data()
    if (data.length === 0) {
      return []
    }
    const band = this.plotWidth() / data.length
    return data.map((datum, index) => ({
      name: datum.name,
      x: MARGIN_LEFT + band * index + band / 2,
    }))
  })

  protected readonly bars = computed<BarGeometry[]>(() => {
    const data = this.data()
    if (data.length === 0) {
      return []
    }
    const band = this.plotWidth() / data.length
    const width = band * BAR_WIDTH_RATIO
    return data.map((datum, index) => {
      const height =
        (Math.max(datum.value, 0) / this.domainMax()) * this.plotHeight()
      const x = MARGIN_LEFT + band * index + (band - width) / 2
      const y = this.baselineY() - height
      return {
        name: datum.name,
        value: datum.value,
        height,
        d: roundedTopBarPath(x, y, width, height, BAR_CORNER_RADIUS),
      }
    })
  })

  private yForValue(value: number): number {
    return this.baselineY() - (value / this.domainMax()) * this.plotHeight()
  }
}
