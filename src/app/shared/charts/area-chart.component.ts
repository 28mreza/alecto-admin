import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core'
import { niceTicks } from './chart-axis.util'
import { areaPath, smoothPath, type ChartPoint } from './chart-path.util'

export interface AreaChartDatum {
  readonly name: string
  readonly clicks: number
  readonly uniques: number
}

interface TickRow {
  readonly value: number
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
const TICK_TARGET_COUNT = 5
const X_LABEL_OFFSET_Y = 18
const Y_LABEL_OFFSET_X = 8
const Y_LABEL_OFFSET_Y = 4
const TICK_FILL = '#888888'
const TICK_FONT_SIZE = 12
const SERIES_STROKE_WIDTH = 2

@Component({
  selector: 'app-area-chart',
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
          {{ tick.value }}
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
      <path
        data-series-area="clicks"
        [attr.d]="clicksArea()"
        fill="currentColor"
        fill-opacity="0.15"
        stroke="none"
        class="text-primary"
      />
      <path
        data-series-area="uniques"
        [attr.d]="uniquesArea()"
        fill="currentColor"
        fill-opacity="0.1"
        stroke="none"
        class="text-muted-foreground"
      />
      <path
        data-series-line="clicks"
        [attr.d]="clicksLine()"
        fill="none"
        stroke="currentColor"
        [attr.stroke-width]="seriesStrokeWidth"
        class="text-primary"
      />
      <path
        data-series-line="uniques"
        [attr.d]="uniquesLine()"
        fill="none"
        stroke="currentColor"
        [attr.stroke-width]="seriesStrokeWidth"
        class="text-muted-foreground"
      />
    </svg>
  `,
})
export class AreaChartComponent {
  readonly data = input<AreaChartDatum[]>([])
  readonly height = input(300)

  protected readonly tickFill = TICK_FILL
  protected readonly tickFontSize = TICK_FONT_SIZE
  protected readonly marginLeft = MARGIN_LEFT
  protected readonly yLabelOffsetX = Y_LABEL_OFFSET_X
  protected readonly yLabelOffsetY = Y_LABEL_OFFSET_Y
  protected readonly seriesStrokeWidth = SERIES_STROKE_WIDTH

  private readonly plotWidth = computed(
    () => VIEW_BOX_WIDTH - MARGIN_LEFT - MARGIN_RIGHT
  )
  private readonly plotHeight = computed(
    () => this.height() - MARGIN_TOP - MARGIN_BOTTOM
  )
  private readonly baselineY = computed(() => MARGIN_TOP + this.plotHeight())
  private readonly maxValue = computed(() =>
    this.data().reduce(
      (max, datum) => Math.max(max, datum.clicks, datum.uniques),
      0
    )
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
    this.data().length === 0 ? 'Area chart with no data' : 'Area chart'
  )
  protected readonly xLabelY = computed(
    () => this.baselineY() + X_LABEL_OFFSET_Y
  )

  protected readonly tickRows = computed<TickRow[]>(() =>
    this.ticks().map((value) => ({ value, y: this.yForValue(value) }))
  )

  protected readonly categoryLabels = computed<CategoryLabel[]>(() =>
    this.data().map((datum, index) => ({
      name: datum.name,
      x: this.xForIndex(index),
    }))
  )

  private readonly clicksPoints = computed<ChartPoint[]>(() =>
    this.data().map((datum, index) => ({
      x: this.xForIndex(index),
      y: this.yForValue(Math.max(datum.clicks, 0)),
    }))
  )

  private readonly uniquesPoints = computed<ChartPoint[]>(() =>
    this.data().map((datum, index) => ({
      x: this.xForIndex(index),
      y: this.yForValue(Math.max(datum.uniques, 0)),
    }))
  )

  protected readonly clicksLine = computed(() =>
    smoothPath(this.clicksPoints())
  )
  protected readonly uniquesLine = computed(() =>
    smoothPath(this.uniquesPoints())
  )
  protected readonly clicksArea = computed(() =>
    areaPath(this.clicksPoints(), this.baselineY())
  )
  protected readonly uniquesArea = computed(() =>
    areaPath(this.uniquesPoints(), this.baselineY())
  )

  private xForIndex(index: number): number {
    const count = this.data().length
    if (count <= 1) {
      return MARGIN_LEFT + this.plotWidth() / 2
    }
    return MARGIN_LEFT + (this.plotWidth() * index) / (count - 1)
  }

  private yForValue(value: number): number {
    return this.baselineY() - (value / this.domainMax()) * this.plotHeight()
  }
}
