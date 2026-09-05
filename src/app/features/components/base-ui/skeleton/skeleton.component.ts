import { ChangeDetectionStrategy, Component } from '@angular/core'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

/**
 * Skeleton page (`/components/skeleton`).
 *
 * Mirrors https://spartan.ng/components/skeleton (ringkas): profile rows
 * and a form plus card loading state.
 */
@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [
    HlmSkeletonImports,
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
  templateUrl: './skeleton.component.html',
})
export class SkeletonComponent {}
