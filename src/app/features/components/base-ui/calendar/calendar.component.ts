import { DatePipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { provideNativeDateAdapter } from '@spartan-ng/brain/date-time'
import { HlmCalendarImports } from '@spartan-ng/helm/calendar'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

/**
 * Calendar page (`/components/calendar`).
 *
 * Mirrors https://spartan.ng/components/calendar: a basic calendar bound to a
 * signal and one with dropdown month/year pickers.
 */
@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    DatePipe,
    HlmCalendarImports,
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
  templateUrl: './calendar.component.html',
})
export class CalendarComponent {
  protected readonly selected = signal<Date | null>(new Date())
  protected readonly dropdownSelected = signal<Date | null>(new Date())
}
