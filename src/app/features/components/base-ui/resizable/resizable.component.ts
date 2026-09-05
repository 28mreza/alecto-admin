import { ChangeDetectionStrategy, Component } from '@angular/core'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmResizableImports } from '@spartan-ng/helm/resizable'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

/**
 * Resizable page (`/components/resizable`).
 *
 * Mirrors https://spartan.ng/components/resizable (ringkas): horizontal
 * panels and a vertical stack. Drag the handle to resize (manual check).
 */
@Component({
  selector: 'app-resizable',
  standalone: true,
  imports: [
    HlmResizableImports,
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
  templateUrl: './resizable.component.html',
})
export class ResizableComponent {}
