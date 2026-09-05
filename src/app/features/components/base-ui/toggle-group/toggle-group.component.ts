import { ChangeDetectionStrategy, Component } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideBold, lucideItalic, lucideUnderline } from '@ng-icons/lucide'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmToggleGroupImports } from '@spartan-ng/helm/toggle-group'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

/**
 * Toggle Group page (`/components/toggle-group`).
 *
 * Mirrors https://spartan.ng/components/toggle-group (ringkas): multiple
 * formatting toggles and a single-select outline group.
 */
@Component({
  selector: 'app-toggle-group',
  standalone: true,
  imports: [
    HlmToggleGroupImports,
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
  providers: [provideIcons({ lucideBold, lucideItalic, lucideUnderline })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toggle-group.component.html',
})
export class ToggleGroupComponent {}
