import { ChangeDetectionStrategy, Component } from '@angular/core'
import { NgScrollbarModule } from 'ngx-scrollbar'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area'
import { HlmSeparatorImports } from '@spartan-ng/helm/separator'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

/**
 * Scroll Area page (`/components/scroll-area`).
 *
 * Mirrors https://spartan.ng/components/scroll-area (ringkas, offline-safe):
 * vertical tag list and horizontal numbered boxes.
 */
@Component({
  selector: 'app-scroll-area',
  standalone: true,
  imports: [
    NgScrollbarModule,
    HlmScrollAreaImports,
    HlmSeparatorImports,
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
  templateUrl: './scroll-area.component.html',
})
export class ScrollAreaComponent {
  protected readonly tags = Array.from({ length: 30 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`)
  protected readonly boxes = Array.from({ length: 12 }, (_, i) => i + 1)
}
