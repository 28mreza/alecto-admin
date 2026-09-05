import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import {
  FlexRender,
  columnFilteringFeature,
  createColumnHelper,
  createCoreRowModel,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  functionalUpdate,
  injectTable,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/angular-table'
import type { PaginationState } from '@tanstack/angular-table'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmCardImports } from '@spartan-ng/helm/card'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmTableImports } from '@spartan-ng/helm/table'
import { ConfigDrawerComponent } from '../../../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../../../components/layout/header/header.component'
import { MainComponent } from '../../../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../../../components/search/search.component'
import { ThemeSwitchComponent } from '../../../../components/theme-switch/theme-switch.component'

interface TeamMember {
  name: string
  email: string
  role: string
}

const features = tableFeatures({
  columnFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  coreRowModel: createCoreRowModel(),
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
})

const columnHelper = createColumnHelper<typeof features, TeamMember>()

const COLUMNS = columnHelper.columns([
  columnHelper.accessor('name', { header: 'Name' }),
  columnHelper.accessor('email', { header: 'Email' }),
  columnHelper.accessor('role', { header: 'Role' }),
])

const MEMBERS: TeamMember[] = [
  { name: 'Muhamad Reza', email: 'reza@example.com', role: 'Admin' },
  { name: 'Sinta Ayu', email: 'sinta@example.com', role: 'Editor' },
  { name: 'Budi Santoso', email: 'budi@example.com', role: 'Viewer' },
  { name: 'Dewi Lestari', email: 'dewi@example.com', role: 'Editor' },
  { name: 'Andi Pratama', email: 'andi@example.com', role: 'Viewer' },
  { name: 'Rina Marlina', email: 'rina@example.com', role: 'Admin' },
  { name: 'Fajar Nugroho', email: 'fajar@example.com', role: 'Viewer' },
  { name: 'Nina Kurnia', email: 'nina@example.com', role: 'Editor' },
  { name: 'Doni Saputra', email: 'doni@example.com', role: 'Viewer' },
  { name: 'Lina Hartati', email: 'lina@example.com', role: 'Admin' },
  { name: 'Eko Wijaya', email: 'eko@example.com', role: 'Editor' },
  { name: 'Rudi Hermawan', email: 'rudi@example.com', role: 'Viewer' },
]

/**
 * Data Table page (`/components/data-table`).
 *
 * TanStack table with helm table styling: a basic table and an interactive
 * one with email filtering, name sorting, and pagination.
 */
@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    FlexRender,
    HlmButtonImports,
    HlmCardImports,
    HlmInputImports,
    HlmTableImports,
    HeaderComponent,
    MainComponent,
    SearchComponent,
    RefreshButtonComponent,
    ThemeSwitchComponent,
    ConfigDrawerComponent,
    ProfileDropdownComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './data-table.component.html',
})
export class DataTableComponent {
  protected readonly members = signal<TeamMember[]>(MEMBERS.slice(0, 5))
  protected readonly allMembers = signal<TeamMember[]>(MEMBERS)
  protected readonly pagination = signal<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  protected readonly basicTable = injectTable(() => ({
    features,
    columns: COLUMNS,
    data: this.members(),
  }))

  protected readonly table = injectTable(() => ({
    features,
    columns: COLUMNS,
    data: this.allMembers(),
    state: { pagination: this.pagination() },
    onPaginationChange: (updater) => {
      this.pagination.update((old) => functionalUpdate(updater, old))
    },
  }))

  protected setEmailFilter(event: Event): void {
    const value = (event.target as HTMLInputElement | null)?.value ?? ''
    this.table.getColumn('email')?.setFilterValue(value)
  }
}
