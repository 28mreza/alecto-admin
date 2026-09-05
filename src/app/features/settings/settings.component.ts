import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { HlmSeparatorImports } from '@spartan-ng/helm/separator'
import { ConfigDrawerComponent } from '../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../components/layout/header/header.component'
import { MainComponent } from '../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../components/search/search.component'
import { ThemeSwitchComponent } from '../../components/theme-switch/theme-switch.component'
import {
  SidebarNavComponent,
  type SettingsNavItem,
} from './components/sidebar-nav.component'

const SIDEBAR_NAV_ITEMS: SettingsNavItem[] = [
  { title: 'Profile', href: '/settings', icon: 'lucideUserCog' },
  { title: 'Account', href: '/settings/account', icon: 'lucideWrench' },
  { title: 'Appearance', href: '/settings/appearance', icon: 'lucidePalette' },
  {
    title: 'Notifications',
    href: '/settings/notifications',
    icon: 'lucideBell',
  },
  { title: 'Display', href: '/settings/display', icon: 'lucideMonitor' },
]

/**
 * Settings shell ported from `shadcn-admin/src/features/settings/index.tsx`.
 * Header (search + theme switch + config drawer + profile dropdown), fixed
 * main with the "Settings" heading, sticky sidebar nav and a router outlet
 * for the five sub-pages.
 */
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    MainComponent,
    SearchComponent,
    RefreshButtonComponent,
    ThemeSwitchComponent,
    ConfigDrawerComponent,
    ProfileDropdownComponent,
    SidebarNavComponent,
    HlmSeparatorImports,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-header>
      <app-search className="me-auto" />
      <app-refresh-button />
      <app-theme-switch />
      <app-config-drawer />
      <app-profile-dropdown />
    </app-header>

    <app-main [fixed]="true">
      <div class="space-y-0.5">
        <h1 class="text-2xl font-bold tracking-tight md:text-3xl">Settings</h1>
        <p class="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <hlm-separator class="my-4 lg:my-6" />
      <div
        class="flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12"
      >
        <aside class="top-0 lg:sticky lg:w-1/5">
          <app-settings-sidebar-nav [items]="navItems" />
        </aside>
        <div class="flex w-full overflow-y-hidden p-1">
          <router-outlet />
        </div>
      </div>
    </app-main>
  `,
})
export class SettingsComponent {
  protected readonly navItems: SettingsNavItem[] = SIDEBAR_NAV_ITEMS
}
