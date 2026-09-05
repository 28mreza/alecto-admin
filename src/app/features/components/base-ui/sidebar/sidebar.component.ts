import { ChangeDetectionStrategy, Component } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideFileText, lucideHome, lucideSettings } from '@ng-icons/lucide'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

/**
 * Sidebar page (`/components/sidebar`).
 *
 * Static mini-mockup (NOT the full layout kit): menu parts inside a plain
 * bordered div. The `hlm-sidebar` element is intentionally unused (fixed
 * positioning would break page layout).
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    HlmSidebarImports,
    NgIcon,
    HlmCardImports,
    HeaderComponent,
    MainComponent,
    SearchComponent,
    RefreshButtonComponent,
    ThemeSwitchComponent,
    ConfigDrawerComponent,
    ProfileDropdownComponent,
  ],
  providers: [provideIcons({ lucideHome, lucideFileText, lucideSettings })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {}
