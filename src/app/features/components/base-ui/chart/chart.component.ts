import { ChangeDetectionStrategy, Component } from '@angular/core'
import type { ChartOptions } from '@tanstack/angular-charts'
import { barX, barY, defineChart } from '@tanstack/charts'
import { scaleBand } from '@tanstack/charts/scales/band'
import { scaleLinear } from '@tanstack/charts/scales/linear'
import { tooltip } from '@tanstack/charts/tooltip'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmChartImports } from '@spartan-ng/helm/chart'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

interface MonthlyRevenue {
  month: string
  value: number
}

const REVENUE: MonthlyRevenue[] = [
  { month: 'Jan', value: 120 },
  { month: 'Feb', value: 190 },
  { month: 'Mar', value: 150 },
  { month: 'Apr', value: 220 },
  { month: 'May', value: 180 },
  { month: 'Jun', value: 260 },
]

/**
 * Chart page (`/components/chart`).
 *
 * TanStack charts wrapped with the helm chart directive: a vertical bar chart
 * and a horizontal bar chart.
 */
@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [
    HlmChartImports,
    HlmCardImports,
    HeaderComponent,
    MainComponent,
    SearchComponent,
    RefreshButtonComponent,
    ThemeSwitchComponent,
    ConfigDrawerComponent,
    ProfileDropdownComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chart.component.html',
})
export class ChartComponent {
  protected readonly barOptions: ChartOptions<MonthlyRevenue, string, number> = {
    definition: defineChart({
      chart: ({ width }) => ({
        marks: [barY(REVENUE, { x: 'month', y: 'value' })],
        scales: {
          x: { scale: scaleBand },
          y: {
            scale: scaleLinear,
            nice: true,
            axis: { ticks: { count: width < 480 ? 4 : 7 } },
            grid: true,
          },
        },
      }),
      focus: 'group-x',
      tooltip: { use: tooltip },
    }),
    ariaLabel: 'Revenue by month',
  }

  protected readonly horizontalOptions: ChartOptions<MonthlyRevenue, number, string> = {
    definition: defineChart({
      marks: [barX(REVENUE, { x: 'value', y: 'month' })],
      scales: {
        x: { scale: scaleLinear, nice: true, grid: true },
        y: { scale: () => scaleBand().padding(0.1) },
      },
    }),
    ariaLabel: 'Revenue by month, horizontal',
  }
}
