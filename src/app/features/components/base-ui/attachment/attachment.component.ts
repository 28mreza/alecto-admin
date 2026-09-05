import { ChangeDetectionStrategy, Component } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideFileCode, lucideFileText, lucideX } from '@ng-icons/lucide'
import { HlmAttachmentImports } from '@spartan-ng/helm/attachment'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

/**
 * Attachment page (`/components/attachment`).
 *
 * Mirrors https://spartan.ng/components/attachment: a file row with a remove
 * action, upload states, a vertical image attachment, and sizes.
 */
@Component({
  selector: 'app-attachment',
  standalone: true,
  imports: [
    NgIcon,
    HlmAttachmentImports,
    HlmCardImports,
    HeaderComponent,
    MainComponent,
    SearchComponent,
    RefreshButtonComponent,
    ThemeSwitchComponent,
    ConfigDrawerComponent,
    ProfileDropdownComponent,
  ],
  providers: [provideIcons({ lucideFileCode, lucideFileText, lucideX })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './attachment.component.html',
})
export class AttachmentComponent {}
