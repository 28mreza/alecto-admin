import { ChangeDetectionStrategy, Component } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideFolderOpen, lucidePlus } from '@ng-icons/lucide'
import { HlmAvatarImports } from '@spartan-ng/helm/avatar'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmEmptyImports } from '@spartan-ng/helm/empty'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

/**
 * Empty page (`/components/empty`).
 *
 * Mirrors https://spartan.ng/components/empty: a basic empty state, a dashed
 * upload dropzone, and an avatar-led team invite.
 */
@Component({
  selector: 'app-empty',
  standalone: true,
  imports: [
    NgIcon,
    HlmAvatarImports,
    HlmButtonImports,
    HlmCardImports,
    HlmEmptyImports,
    HeaderComponent,
    MainComponent,
    SearchComponent,
    RefreshButtonComponent,
    ThemeSwitchComponent,
    ConfigDrawerComponent,
    ProfileDropdownComponent,
  ],
  providers: [provideIcons({ lucideFolderOpen, lucidePlus })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './empty.component.html',
})
export class EmptyComponent {}
