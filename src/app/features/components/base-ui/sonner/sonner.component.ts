import { ChangeDetectionStrategy, Component } from '@angular/core'
import { toast } from '@spartan-ng/brain/sonner'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

/**
 * Sonner page (`/components/sonner`).
 *
 * Toasts render in the GLOBAL hlm-toaster (authenticated layout) — this
 * page only fires them. Click a button to see the toast (manual check).
 */
@Component({
  selector: 'app-sonner',
  standalone: true,
  imports: [
    HlmButtonImports,
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
  templateUrl: './sonner.component.html',
})
export class SonnerComponent {
  protected showDefault(): void {
    toast('Event has been created')
  }

  protected showSuccess(): void {
    toast.success('Event has been created')
  }

  protected showError(): void {
    toast.error('Failed to create event')
  }

  protected showInfo(): void {
    toast.info('Event will start in 10 minutes')
  }

  protected showWithDescription(): void {
    toast('Event has been created', {
      description: 'Sunday, December 03, 2023 at 9:00 AM',
    })
  }
}
