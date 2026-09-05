import { ChangeDetectionStrategy, Component } from '@angular/core'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu'
import { HlmMenubarImports } from '@spartan-ng/helm/menubar'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

/**
 * Menubar page (`/components/menubar`).
 *
 * Mirrors https://spartan.ng/components/menubar (ringkas): File+Edit menus,
 * View checkbox, Profiles radio. Content renders in CDK overlay only while
 * open, so verification asserts triggers statically (same as dropdown-menu).
 */
@Component({
  selector: 'app-menubar',
  standalone: true,
  imports: [
    HlmMenubarImports,
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
  templateUrl: './menubar.component.html',
})
export class MenubarComponent {}
