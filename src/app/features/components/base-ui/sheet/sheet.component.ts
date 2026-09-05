import { ChangeDetectionStrategy, Component } from '@angular/core'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmSheetImports } from '@spartan-ng/helm/sheet'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

/**
 * Sheet page (`/components/sheet`).
 *
 * Mirrors https://spartan.ng/components/sheet (ringkas): one sheet per
 * side. Content renders in the overlay only while open, so verification
 * asserts triggers statically (same as dropdown-menu/menubar/popover).
 */
@Component({
  selector: 'app-sheet',
  standalone: true,
  imports: [
    HlmSheetImports,
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
  templateUrl: './sheet.component.html',
})
export class SheetComponent {}
