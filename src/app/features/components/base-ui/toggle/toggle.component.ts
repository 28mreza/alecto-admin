import { ChangeDetectionStrategy, Component } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideBold, lucideBookmark, lucideItalic } from '@ng-icons/lucide'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmToggleImports } from '@spartan-ng/helm/toggle'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

/**
 * Toggle page (`/components/toggle`).
 *
 * Mirrors https://spartan.ng/components/toggle (ringkas): bookmark,
 * with-text, and outline variants.
 */
@Component({
  selector: 'app-toggle',
  standalone: true,
  imports: [
    HlmToggleImports,
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
  providers: [provideIcons({ lucideBookmark, lucideBold, lucideItalic })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toggle.component.html',
})
export class ToggleComponent {}
