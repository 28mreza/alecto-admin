import { DatePipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { provideNativeDateAdapter } from '@spartan-ng/brain/date-time'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

/**
 * Date Picker page (`/components/date-picker`).
 *
 * Mirrors https://spartan.ng/components/date-picker: a single date picker
 * and a range picker bound to signals.
 */
@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [
    DatePipe,
    HlmDatePickerImports,
    HlmCardImports,
    HeaderComponent,
    MainComponent,
    SearchComponent,
    RefreshButtonComponent,
    ThemeSwitchComponent,
    ConfigDrawerComponent,
    ProfileDropdownComponent,
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './date-picker.component.html',
})
export class DatePickerComponent {
  protected readonly date = signal<Date | undefined>(undefined)
  protected readonly range = signal<[Date, Date]>([
    new Date(2026, 8, 1),
    new Date(2026, 8, 5),
  ])

  protected onDateChange(value: Date | null): void {
    this.date.set(value ?? undefined)
  }

  protected onRangeChange(value: [Date, Date] | null): void {
    if (value) this.range.set(value)
  }
}
