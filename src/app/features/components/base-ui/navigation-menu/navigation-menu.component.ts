import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideInfo } from '@ng-icons/lucide'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmNavigationMenuImports } from '@spartan-ng/helm/navigation-menu'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

/**
 * Navigation Menu page (`/components/navigation-menu`).
 *
 * Mirrors https://spartan.ng/components/navigation-menu (ringkas): two
 * dropdown triggers and one direct link. Content renders in overlay only
 * while open, so verification asserts triggers statically.
 */
@Component({
  selector: 'app-navigation-menu',
  standalone: true,
  imports: [
    HlmNavigationMenuImports,
    HlmCardImports,
    NgIcon,
    RouterLink,
    HeaderComponent,
    MainComponent,
    SearchComponent,
    RefreshButtonComponent,
    ThemeSwitchComponent,
    ConfigDrawerComponent,
    ProfileDropdownComponent,
  ],
  providers: [provideIcons({ lucideInfo })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './navigation-menu.component.html',
})
export class NavigationMenuComponent {}
