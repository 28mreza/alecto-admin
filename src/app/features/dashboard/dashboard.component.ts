import { ChangeDetectionStrategy, Component } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import {
  lucideActivity,
  lucideCreditCard,
  lucideDollarSign,
  lucideUsers,
} from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmTabsImports } from '@spartan-ng/helm/tabs'
import { ConfigDrawerComponent } from '../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../components/layout/header/header.component'
import { MainComponent } from '../../components/layout/main/main.component'
import {
  TopNavComponent,
  type TopNavLink,
} from '../../components/layout/top-nav/top-nav.component'
import { ProfileDropdownComponent } from '../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../components/search/search.component'
import { ThemeSwitchComponent } from '../../components/theme-switch/theme-switch.component'
import { DashboardAnalyticsComponent } from './components/analytics.component'
import { OverviewChartComponent } from './components/overview-chart.component'
import { RecentSalesComponent } from './components/recent-sales.component'

const TOP_NAV_LINKS: TopNavLink[] = [
  {
    title: 'Overview',
    href: 'dashboard/overview',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Customers',
    href: 'dashboard/customers',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Products',
    href: 'dashboard/products',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Settings',
    href: 'dashboard/settings',
    isActive: false,
    disabled: true,
  },
]

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgIcon,
    HlmButtonImports,
    HlmCardImports,
    HlmTabsImports,
    HeaderComponent,
    MainComponent,
    TopNavComponent,
    SearchComponent,
    RefreshButtonComponent,
    ThemeSwitchComponent,
    ConfigDrawerComponent,
    ProfileDropdownComponent,
    OverviewChartComponent,
    RecentSalesComponent,
    DashboardAnalyticsComponent,
  ],
  providers: [
    provideIcons({
      lucideActivity,
      lucideCreditCard,
      lucideDollarSign,
      lucideUsers,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  protected readonly topNavLinks: TopNavLink[] = TOP_NAV_LINKS
}
