import { ChangeDetectionStrategy, Component } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import {
  lucideClock,
  lucideTrendingDown,
  lucideTrendingUp,
  lucideUsers,
} from '@ng-icons/lucide'
import { HlmCardImports } from '@spartan-ng/helm/card'
import {
  AreaChartComponent,
  type AreaChartDatum,
} from '../../../shared/charts/area-chart.component'
import {
  SimpleBarListComponent,
  type BarListItem,
} from '../../../shared/charts/simple-bar-list.component'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

export function makeAnalyticsData(): AreaChartDatum[] {
  return DAYS.map((name) => ({
    name,
    clicks: Math.floor(Math.random() * 900) + 100,
    uniques: Math.floor(Math.random() * 700) + 80,
  }))
}

const REFERRERS: BarListItem[] = [
  { name: 'Direct', value: 512 },
  { name: 'Product Hunt', value: 238 },
  { name: 'Twitter', value: 174 },
  { name: 'Blog', value: 104 },
]

const DEVICES: BarListItem[] = [
  { name: 'Desktop', value: 74 },
  { name: 'Mobile', value: 22 },
  { name: 'Tablet', value: 4 },
]

@Component({
  selector: 'app-dashboard-analytics',
  standalone: true,
  imports: [NgIcon, HlmCardImports, AreaChartComponent, SimpleBarListComponent],
  providers: [
    provideIcons({
      lucideClock,
      lucideTrendingDown,
      lucideTrendingUp,
      lucideUsers,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-4">
      <section hlmCard>
        <div hlmCardHeader>
          <h3 hlmCardTitle>Traffic Overview</h3>
          <p hlmCardDescription>Weekly clicks and unique visitors</p>
        </div>
        <div hlmCardContent class="px-6">
          <app-area-chart [data]="traffic" [height]="300" />
        </div>
      </section>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <section hlmCard>
          <div
            hlmCardHeader
            class="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <h3 hlmCardTitle class="text-sm font-medium">Total Clicks</h3>
            <ng-icon
              name="lucideTrendingUp"
              class="text-muted-foreground h-4 w-4"
            />
          </div>
          <div hlmCardContent>
            <div class="text-2xl font-bold">1,248</div>
            <p class="text-muted-foreground text-xs">+12.4% vs last week</p>
          </div>
        </section>
        <section hlmCard>
          <div
            hlmCardHeader
            class="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <h3 hlmCardTitle class="text-sm font-medium">Unique Visitors</h3>
            <ng-icon name="lucideUsers" class="text-muted-foreground h-4 w-4" />
          </div>
          <div hlmCardContent>
            <div class="text-2xl font-bold">832</div>
            <p class="text-muted-foreground text-xs">+5.8% vs last week</p>
          </div>
        </section>
        <section hlmCard>
          <div
            hlmCardHeader
            class="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <h3 hlmCardTitle class="text-sm font-medium">Bounce Rate</h3>
            <ng-icon
              name="lucideTrendingDown"
              class="text-muted-foreground h-4 w-4"
            />
          </div>
          <div hlmCardContent>
            <div class="text-2xl font-bold">42%</div>
            <p class="text-muted-foreground text-xs">-3.2% vs last week</p>
          </div>
        </section>
        <section hlmCard>
          <div
            hlmCardHeader
            class="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <h3 hlmCardTitle class="text-sm font-medium">Avg. Session</h3>
            <ng-icon name="lucideClock" class="text-muted-foreground h-4 w-4" />
          </div>
          <div hlmCardContent>
            <div class="text-2xl font-bold">3m 24s</div>
            <p class="text-muted-foreground text-xs">+18s vs last week</p>
          </div>
        </section>
      </div>
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <section hlmCard class="col-span-1 lg:col-span-4">
          <div hlmCardHeader>
            <h3 hlmCardTitle>Referrers</h3>
            <p hlmCardDescription>Top sources driving traffic</p>
          </div>
          <div hlmCardContent>
            <app-simple-bar-list
              [items]="referrers"
              barClass="bg-primary"
              [valueFormatter]="formatCount"
            />
          </div>
        </section>
        <section hlmCard class="col-span-1 lg:col-span-3">
          <div hlmCardHeader>
            <h3 hlmCardTitle>Devices</h3>
            <p hlmCardDescription>How users access your app</p>
          </div>
          <div hlmCardContent>
            <app-simple-bar-list
              [items]="devices"
              barClass="bg-muted-foreground"
              [valueFormatter]="formatPercent"
            />
          </div>
        </section>
      </div>
    </div>
  `,
})
export class DashboardAnalyticsComponent {
  protected readonly traffic: AreaChartDatum[] = makeAnalyticsData()
  protected readonly referrers: BarListItem[] = REFERRERS
  protected readonly devices: BarListItem[] = DEVICES

  protected formatCount(value: number): string {
    return `${value}`
  }

  protected formatPercent(value: number): string {
    return `${value}%`
  }
}
