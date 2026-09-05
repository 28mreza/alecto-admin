import { ChangeDetectionStrategy, Component } from '@angular/core'
import { BrnInputOtp } from '@spartan-ng/brain/input-otp'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmInputOtpImports } from '@spartan-ng/helm/input-otp'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

/**
 * Input OTP page (`/components/input-otp`).
 *
 * Mirrors https://spartan.ng/components/input-otp: six-digit and four-digit
 * PIN entry with grouped slots and separators.
 */
@Component({
  selector: 'app-input-otp',
  standalone: true,
  imports: [
    BrnInputOtp,
    HlmInputOtpImports,
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
  templateUrl: './input-otp.component.html',
})
export class InputOtpComponent {}
