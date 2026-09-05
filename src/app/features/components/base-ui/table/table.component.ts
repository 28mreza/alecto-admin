import { ChangeDetectionStrategy, Component } from '@angular/core'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmTableImports } from '@spartan-ng/helm/table'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

/**
 * Table page (`/components/table`).
 *
 * Static invoice tables (no sorting/pagination — that lives in
 * `/components/data-table`).
 */
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    HlmTableImports,
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
  templateUrl: './table.component.html',
})
export class TableComponent {
  protected readonly invoices = [
    { id: 'INV001', status: 'Paid', method: 'Credit Card', amount: '$250.00' },
    { id: 'INV002', status: 'Pending', method: 'PayPal', amount: '$150.00' },
    { id: 'INV003', status: 'Unpaid', method: 'Bank Transfer', amount: '$350.00' },
  ]
}
