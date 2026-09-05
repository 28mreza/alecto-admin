import { ChangeDetectionStrategy, Component } from '@angular/core'
import { HlmAvatarImports } from '@spartan-ng/helm/avatar'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmHoverCardImports } from '@spartan-ng/helm/hover-card'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

/**
 * Hover Card page (`/components/hover-card`).
 *
 * Mirrors https://spartan.ng/components/hover-card: a text preview card and
 * a profile card. Card content renders in the CDK overlay only while open, so
 * the specs assert headings and triggers statically.
 */
@Component({
  selector: 'app-hover-card',
  standalone: true,
  imports: [
    HlmAvatarImports,
    HlmButtonImports,
    HlmCardImports,
    HlmHoverCardImports,
    HeaderComponent,
    MainComponent,
    SearchComponent,
    RefreshButtonComponent,
    ThemeSwitchComponent,
    ConfigDrawerComponent,
    ProfileDropdownComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hover-card.component.html',
})
export class HoverCardComponent {}
