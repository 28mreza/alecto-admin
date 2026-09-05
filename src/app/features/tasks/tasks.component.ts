import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ConfigDrawerComponent } from '../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../components/layout/header/header.component'
import { MainComponent } from '../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../components/search/search.component'
import { ThemeSwitchComponent } from '../../components/theme-switch/theme-switch.component'
import { TasksDialogsComponent } from './components/tasks-dialogs.component'
import { TasksPrimaryButtonsComponent } from './components/tasks-primary-buttons.component'
import { TasksTableComponent } from './components/tasks-table.component'
import { TasksStoreService } from './store/tasks-store.service'

/**
 * Tasks page (`/tasks`).
 *
 * Ported from `shadcn-admin/src/features/tasks/index.tsx`: fixed header
 * (search + theme switch + config drawer + profile), heading row and the
 * tasks table with its dialogs. Provides `TasksStoreService` locally so the
 * task list and dialog state are page-scoped.
 */
@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    HeaderComponent,
    MainComponent,
    SearchComponent,
    RefreshButtonComponent,
    ThemeSwitchComponent,
    ConfigDrawerComponent,
    ProfileDropdownComponent,
    TasksPrimaryButtonsComponent,
    TasksTableComponent,
    TasksDialogsComponent,
  ],
  providers: [TasksStoreService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tasks.component.html',
})
export class TasksComponent {}
