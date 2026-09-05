import { ChangeDetectionStrategy, Component } from '@angular/core'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmContextMenuImports } from '@spartan-ng/helm/context-menu'
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

/**
 * Context Menu page (`/components/context-menu`).
 *
 * Mirrors https://spartan.ng/components/context-menu: a right-click account
 * menu and a danger-zone menu. Menu content renders in the CDK overlay only
 * while open, so the specs assert the trigger areas statically.
 */
@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [
    HlmContextMenuImports,
    HlmDropdownMenuImports,
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
  templateUrl: './context-menu.component.html',
})
export class ContextMenuComponent {}
