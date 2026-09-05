import { ChangeDetectionStrategy, Component } from '@angular/core'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmLabelImports } from '@spartan-ng/helm/label'
import { HlmSwitchImports } from '@spartan-ng/helm/switch'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

/**
 * Switch page (`/components/switch`).
 *
 * Labelled toggles and disabled states (ringkas).
 */
@Component({
  selector: 'app-switch',
  standalone: true,
  imports: [
    HlmSwitchImports,
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
  templateUrl: './switch.component.html',
})
export class SwitchComponent {}
