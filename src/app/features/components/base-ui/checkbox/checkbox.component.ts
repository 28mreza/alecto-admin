import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

/**
 * Checkbox page (`/components/checkbox`).
 *
 * Mirrors https://spartan.ng/components/checkbox: basic, disabled and
 * required checkboxes bound to signals.
 */
@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [
    HlmCheckboxImports,
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
  templateUrl: './checkbox.component.html',
})
export class CheckboxComponent {
  protected readonly terms = signal(false)
  protected readonly newsletter = signal(true)
}
