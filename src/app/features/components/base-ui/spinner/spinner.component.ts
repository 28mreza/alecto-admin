import { ChangeDetectionStrategy, Component } from '@angular/core'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

/**
 * Spinner page (`/components/spinner`).
 *
 * Mirrors https://spartan.ng/components/spinner (ringkas): sizes and
 * spinners inside disabled buttons.
 */
@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [
    HlmSpinnerImports,
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
  templateUrl: './spinner.component.html',
})
export class SpinnerComponent {}
