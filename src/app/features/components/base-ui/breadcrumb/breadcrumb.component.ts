import { ChangeDetectionStrategy, Component } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideSlash } from '@ng-icons/lucide'
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

/**
 * Breadcrumb page (`/components/breadcrumb`).
 *
 * Mirrors https://spartan.ng/components/breadcrumb: a basic trail, a
 * collapsed trail with ellipsis, and a custom separator.
 */
@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [
    NgIcon,
    HlmBreadcrumbImports,
    HlmCardImports,
    HeaderComponent,
    MainComponent,
    SearchComponent,
    RefreshButtonComponent,
    ThemeSwitchComponent,
    ConfigDrawerComponent,
    ProfileDropdownComponent,
  ],
  providers: [provideIcons({ lucideSlash })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './breadcrumb.component.html',
})
export class BreadcrumbComponent {}
