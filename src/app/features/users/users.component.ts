import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ConfigDrawerComponent } from '../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../components/layout/header/header.component'
import { MainComponent } from '../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../components/search/search.component'
import { ThemeSwitchComponent } from '../../components/theme-switch/theme-switch.component'
import { UsersDialogsComponent } from './components/users-dialogs.component'
import { UsersPrimaryButtonsComponent } from './components/users-primary-buttons.component'
import { UsersTableComponent } from './components/users-table.component'
import { UsersStoreService } from './store/users-store.service'

/**
 * Users page (`/users`).
 *
 * Ported from `shadcn-admin/src/features/users/index.tsx`: fixed header
 * (search + theme switch + config drawer + profile), the "User List"
 * heading row and the users table with its dialogs. Provides
 * `UsersStoreService` locally so the user list and dialog state are
 * page-scoped.
 */
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    HeaderComponent,
    MainComponent,
    SearchComponent,
    RefreshButtonComponent,
    ThemeSwitchComponent,
    ConfigDrawerComponent,
    ProfileDropdownComponent,
    UsersPrimaryButtonsComponent,
    UsersTableComponent,
    UsersDialogsComponent,
  ],
  providers: [UsersStoreService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './users.component.html',
})
export class UsersComponent {}
