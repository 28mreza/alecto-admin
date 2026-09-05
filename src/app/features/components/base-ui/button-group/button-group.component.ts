import { ChangeDetectionStrategy, Component } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideCheck, lucidePlus, lucideX } from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmButtonGroupImports } from '@spartan-ng/helm/button-group'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

/**
 * Button Group page (`/components/button-group`).
 *
 * Mirrors https://spartan.ng/components/button-group: horizontal and vertical
 * groups, a split button, and a group with an input.
 */
@Component({
  selector: 'app-button-group',
  standalone: true,
  imports: [
    NgIcon,
    HlmButtonGroupImports,
    HlmButtonImports,
    HlmInputImports,
    HlmCardImports,
    HeaderComponent,
    MainComponent,
    SearchComponent,
    RefreshButtonComponent,
    ThemeSwitchComponent,
    ConfigDrawerComponent,
    ProfileDropdownComponent,
  ],
  providers: [provideIcons({ lucideCheck, lucidePlus, lucideX })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button-group.component.html',
})
export class ButtonGroupComponent {}
