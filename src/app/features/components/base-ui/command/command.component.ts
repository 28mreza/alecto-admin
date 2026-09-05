import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { BrnCommandEmpty } from '@spartan-ng/brain/command'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmCommandImports } from '@spartan-ng/helm/command'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

/**
 * Command page (`/components/command`).
 *
 * Mirrors https://spartan.ng/components/command: an inline filterable command
 * list with groups. Filtering is provided by the brain command primitive.
 */
@Component({
  selector: 'app-command',
  standalone: true,
  imports: [
    BrnCommandEmpty,
    HlmCommandImports,
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
  templateUrl: './command.component.html',
})
export class CommandComponent {
  protected readonly pages = ['Dashboard', 'Tasks', 'Users', 'Settings']
  protected readonly actions = ['New File', 'Export', 'Print']

  protected readonly lastRun = signal('none')

  protected run(value: string): void {
    this.lastRun.set(value)
  }
}
