import { ChangeDetectionStrategy, Component } from '@angular/core'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmLabelImports } from '@spartan-ng/helm/label'
import { HlmPopoverImports } from '@spartan-ng/helm/popover'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

/**
 * Popover page (`/components/popover`).
 *
 * Mirrors https://spartan.ng/components/popover (ringkas): a dimensions
 * form popover and a basic header popover. Content renders in the CDK
 * overlay only while open, so verification asserts triggers statically
 * (same as dropdown-menu/menubar).
 */
@Component({
  selector: 'app-popover',
  standalone: true,
  imports: [
    HlmPopoverImports,
    HlmButtonImports,
    HlmLabelImports,
    HlmInputImports,
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
  templateUrl: './popover.component.html',
})
export class PopoverComponent {}
