import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  BarChartComponent,
  type BarChartDatum,
} from '../../../shared/charts/bar-chart.component'

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const

export function makeOverviewData(): BarChartDatum[] {
  return MONTHS.map((name) => ({
    name,
    value: Math.floor(Math.random() * 5000) + 1000,
  }))
}

@Component({
  selector: 'app-overview-chart',
  standalone: true,
  imports: [BarChartComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <app-bar-chart [data]="data" [height]="350" yPrefix="$" /> `,
})
export class OverviewChartComponent {
  protected readonly data: BarChartDatum[] = makeOverviewData()
}
