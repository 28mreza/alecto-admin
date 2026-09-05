import { ChangeDetectionStrategy, Component } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideTriangleAlert } from '@ng-icons/lucide'
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog'
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
 * Alert Dialog page (`/components/alert-dialog`).
 *
 * Mirrors https://spartan.ng/components/alert-dialog: a confirm dialog and a
 * destructive dialog with a media icon. Dialog content renders in the CDK
 * overlay only while open, so the specs assert the triggers statically.
 */
@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [
    NgIcon,
    HlmAlertDialogImports,
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
  providers: [provideIcons({ lucideTriangleAlert })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './alert-dialog.component.html',
})
export class AlertDialogComponent {}
