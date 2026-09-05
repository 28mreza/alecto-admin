import { ChangeDetectionStrategy, Component } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideChevronsUpDown } from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

/**
 * Collapsible page (`/components/collapsible`).
 *
 * Mirrors https://spartan.ng/components/collapsible: a closed-by-default and
 * an open-by-default collapsible section.
 */
@Component({
  selector: 'app-collapsible',
  standalone: true,
  imports: [
    NgIcon,
    HlmButtonImports,
    HlmCardImports,
    HlmCollapsibleImports,
    HeaderComponent,
    MainComponent,
    SearchComponent,
    RefreshButtonComponent,
    ThemeSwitchComponent,
    ConfigDrawerComponent,
    ProfileDropdownComponent,
  ],
  providers: [provideIcons({ lucideChevronsUpDown })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './collapsible.component.html',
})
export class CollapsibleComponent {}
