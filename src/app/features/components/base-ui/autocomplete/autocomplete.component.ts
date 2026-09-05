import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core'
import { HlmAutocompleteImports } from '@spartan-ng/helm/autocomplete'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

/**
 * Autocomplete page (`/components/autocomplete`).
 *
 * Mirrors https://spartan.ng/components/autocomplete: a filterable list, a
 * grouped list, and an input with a clear button. Overlay content renders in
 * the CDK overlay only while open, so the specs assert the inputs statically.
 */
@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [
    HlmAutocompleteImports,
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
  templateUrl: './autocomplete.component.html',
})
export class AutocompleteComponent {
  protected readonly frameworks = [
    'Angular',
    'React',
    'Vue',
    'Svelte',
    'Solid',
    'Qwik',
  ]
  protected readonly fruits = ['Apple', 'Banana', 'Orange']
  protected readonly vegetables = ['Carrot', 'Broccoli', 'Spinach']

  protected readonly search = signal('')
  protected readonly groupedSearch = signal('')
  protected readonly clearSearch = signal('Angular')

  protected readonly filteredFrameworks = computed(() =>
    this.filterOptions(this.frameworks, this.search())
  )
  protected readonly filteredFruits = computed(() =>
    this.filterOptions(this.fruits, this.groupedSearch())
  )
  protected readonly filteredVegetables = computed(() =>
    this.filterOptions(this.vegetables, this.groupedSearch())
  )
  protected readonly filteredClear = computed(() =>
    this.filterOptions(this.frameworks, this.clearSearch())
  )

  protected filterOptions(options: string[], query: string): string[] {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter((option) => option.toLowerCase().includes(q))
  }
}
