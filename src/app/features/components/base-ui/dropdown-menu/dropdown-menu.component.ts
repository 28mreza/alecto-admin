import { ChangeDetectionStrategy, Component } from '@angular/core'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

/**
 * Dropdown Menu page (`/components/dropdown-menu`).
 *
 * Mirrors https://spartan.ng/components/dropdown-menu: a basic account menu
 * and one with disabled and destructive items. Menu content renders in the
 * CDK overlay only while open, so the specs assert the triggers statically.
 */
@Component({
  selector: 'app-dropdown-menu',
  standalone: true,
  imports: [
    HlmDropdownMenuImports,
    HlmButtonImports,
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
  templateUrl: './dropdown-menu.component.html',
})
export class DropdownMenuComponent {}
