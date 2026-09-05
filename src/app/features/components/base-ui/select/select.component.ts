import { ChangeDetectionStrategy, Component } from '@angular/core'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmLabelImports } from '@spartan-ng/helm/label'
import { HlmSelectImports } from '@spartan-ng/helm/select'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

/**
 * Select page (`/components/select`).
 *
 * Mirrors https://spartan.ng/components/select (ringkas): fruit picker,
 * labelled select, and disabled select.
 */
@Component({
  selector: 'app-select',
  standalone: true,
  imports: [
    HlmSelectImports,
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
  templateUrl: './select.component.html',
})
export class SelectComponent {
  protected readonly fruits = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Blueberry', value: 'blueberry' },
    { label: 'Grapes', value: 'grapes' },
    { label: 'Pineapple', value: 'pineapple' },
  ]

  protected readonly itemToString = (value: string) =>
    this.fruits.find((item) => item.value === value)?.label || ''
}
