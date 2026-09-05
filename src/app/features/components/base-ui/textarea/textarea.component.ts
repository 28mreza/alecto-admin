import { ChangeDetectionStrategy, Component } from '@angular/core'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmLabelImports } from '@spartan-ng/helm/label'
import { HlmTextareaImports } from '@spartan-ng/helm/textarea'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

/**
 * Textarea page (`/components/textarea`).
 *
 * Labelled, disabled, and helper-text variants (ringkas).
 */
@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [
    HlmTextareaImports,
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
  templateUrl: './textarea.component.html',
})
export class TextareaComponent {}
