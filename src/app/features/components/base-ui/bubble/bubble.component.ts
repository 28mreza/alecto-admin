import { ChangeDetectionStrategy, Component } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideThumbsUp } from '@ng-icons/lucide'
import { HlmBubbleImports } from '@spartan-ng/helm/bubble'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

/**
 * Bubble page (`/components/bubble`).
 *
 * Mirrors https://spartan.ng/components/bubble: a two-sided conversation,
 * style variants, and a message with reactions.
 */
@Component({
  selector: 'app-bubble',
  standalone: true,
  imports: [
    NgIcon,
    HlmBubbleImports,
    HlmCardImports,
    HeaderComponent,
    MainComponent,
    SearchComponent,
    RefreshButtonComponent,
    ThemeSwitchComponent,
    ConfigDrawerComponent,
    ProfileDropdownComponent,
  ],
  providers: [provideIcons({ lucideThumbsUp })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bubble.component.html',
})
export class BubbleComponent {}
