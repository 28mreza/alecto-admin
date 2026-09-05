import { ChangeDetectionStrategy, Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmLabelImports } from '@spartan-ng/helm/label'
import { HlmRadioGroupImports } from '@spartan-ng/helm/radio-group'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

/**
 * Radio Group page (`/components/radio-group`).
 *
 * Mirrors https://spartan.ng/components/radio-group (ringkas): basic
 * spacing picker and a disabled option.
 */
@Component({
  selector: 'app-radio-group',
  standalone: true,
  imports: [
    FormsModule,
    HlmRadioGroupImports,
    HlmLabelImports,
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
  templateUrl: './radio-group.component.html',
})
export class RadioGroupComponent {
  protected spacing = 'comfortable'
}
