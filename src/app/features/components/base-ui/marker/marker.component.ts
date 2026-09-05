import { ChangeDetectionStrategy, Component } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideGitBranch, lucideSearch } from '@ng-icons/lucide'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmMarkerImports } from '@spartan-ng/helm/marker'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

/**
 * Marker page (`/components/marker`).
 *
 * Mirrors https://spartan.ng/components/marker (ringkas, tanpa spinner):
 * basic, separator, shimmer status.
 */
@Component({
  selector: 'app-marker',
  standalone: true,
  imports: [
    HlmMarkerImports,
    HlmCardImports,
    NgIcon,
    HeaderComponent,
    MainComponent,
    SearchComponent,
    RefreshButtonComponent,
    ThemeSwitchComponent,
    ConfigDrawerComponent,
    ProfileDropdownComponent,
  ],
  providers: [provideIcons({ lucideGitBranch, lucideSearch })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './marker.component.html',
})
export class MarkerComponent {}
