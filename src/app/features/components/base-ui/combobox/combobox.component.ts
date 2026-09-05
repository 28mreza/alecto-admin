import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmComboboxImports } from '@spartan-ng/helm/combobox'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

interface ComboboxOption {
  label: string
  value: string
}

/**
 * Combobox page (`/components/combobox`).
 *
 * Mirrors https://spartan.ng/components/combobox: a single-select and a
 * grouped combobox. Overlay content renders in the CDK overlay only while
 * open, so the specs assert the inputs statically.
 */
@Component({
  selector: 'app-combobox',
  standalone: true,
  imports: [
    HlmComboboxImports,
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
  templateUrl: './combobox.component.html',
})
export class ComboboxComponent {
  protected readonly frameworks: ComboboxOption[] = [
    { label: 'Angular', value: 'angular' },
    { label: 'React', value: 'react' },
    { label: 'Vue', value: 'vue' },
    { label: 'Svelte', value: 'svelte' },
    { label: 'Solid', value: 'solid' },
  ]
  protected readonly libraries: ComboboxOption[] = [
    { label: 'TanStack Query', value: 'tanstack-query' },
    { label: 'Zustand', value: 'zustand' },
    { label: 'Redux', value: 'redux' },
  ]

  protected readonly selected = signal('')
  protected readonly groupedSelected = signal('')
}
