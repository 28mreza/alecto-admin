import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NgIcon, provideIcons } from '@ng-icons/core'
import {
  lucideArrowDownAZ,
  lucideArrowUpAZ,
  lucideSlidersHorizontal,
} from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmSelectImports } from '@spartan-ng/helm/select'
import { HlmSeparatorImports } from '@spartan-ng/helm/separator'
import { ConfigDrawerComponent } from '../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../components/layout/header/header.component'
import { MainComponent } from '../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../components/search/search.component'
import { ThemeSwitchComponent } from '../../components/theme-switch/theme-switch.component'
import { BrandIconComponent } from '../../shared/icons/brand/brand-icon.component'
import { apps, filterApps, type AppSort, type AppType } from './data/apps'

function parseAppType(value: unknown): AppType {
  return value === 'connected' || value === 'notConnected' ? value : 'all'
}

function parseSort(value: unknown): AppSort {
  return value === 'desc' ? 'desc' : 'asc'
}

/**
 * Apps page (`/apps`).
 *
 * Ported from `shadcn-admin/src/features/apps/index.tsx`: fixed header
 * (search + theme switch + config drawer + profile), the "App
 * Integrations" heading, a search/type/sort filter row synced to the URL
 * query params (`filter`, `type`, `sort`) and the integration cards grid.
 * Connect buttons are static (no toggle), faithful to the source.
 */
@Component({
  selector: 'app-apps',
  standalone: true,
  imports: [
    HeaderComponent,
    MainComponent,
    SearchComponent,
    RefreshButtonComponent,
    ThemeSwitchComponent,
    ConfigDrawerComponent,
    ProfileDropdownComponent,
    BrandIconComponent,
    NgIcon,
    HlmButtonImports,
    HlmInputImports,
    HlmSelectImports,
    HlmSeparatorImports,
  ],
  providers: [
    provideIcons({
      lucideSlidersHorizontal,
      lucideArrowUpAZ,
      lucideArrowDownAZ,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './apps.component.html',
})
export class AppsComponent {
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)

  protected readonly searchTerm = signal(
    String(this.route.snapshot.queryParams['filter'] ?? '')
  )
  protected readonly appType = signal<AppType>(
    parseAppType(this.route.snapshot.queryParams['type'])
  )
  protected readonly sort = signal<AppSort>(
    parseSort(this.route.snapshot.queryParams['sort'])
  )

  protected readonly filteredApps = computed(() =>
    filterApps(apps, {
      searchTerm: this.searchTerm(),
      type: this.appType(),
      sort: this.sort(),
    })
  )

  protected onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value
    this.searchTerm.set(value)
    this.syncQueryParams({ filter: value || null })
  }

  protected onTypeChange(value: unknown): void {
    const next = parseAppType(value)
    this.appType.set(next)
    this.syncQueryParams({ type: next === 'all' ? null : next })
  }

  protected onSortChange(value: unknown): void {
    const next = parseSort(value)
    this.sort.set(next)
    this.syncQueryParams({ sort: next === 'asc' ? null : next })
  }

  private syncQueryParams(queryParams: Record<string, string | null>): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    })
  }
}
