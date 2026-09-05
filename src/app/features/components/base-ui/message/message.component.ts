import { ChangeDetectionStrategy, Component } from '@angular/core'
import { HlmAvatarImports } from '@spartan-ng/helm/avatar'
import { HlmBubbleImports } from '@spartan-ng/helm/bubble'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmMarkerImports } from '@spartan-ng/helm/marker'
import { HlmMessageImports } from '@spartan-ng/helm/message'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

/**
 * Message page (`/components/message`).
 *
 * Mirrors https://spartan.ng/components/message (ringkas): incoming/outgoing,
 * group + footer, typing marker.
 */
@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    HlmMessageImports,
    HlmBubbleImports,
    HlmAvatarImports,
    HlmMarkerImports,
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
  templateUrl: './message.component.html',
})
export class MessageComponent {}
