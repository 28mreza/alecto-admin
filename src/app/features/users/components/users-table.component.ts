import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import {
  lucideCreditCard,
  lucideShield,
  lucideUserCheck,
  lucideUsers,
} from '@ng-icons/lucide'
import { HlmBadgeImports } from '@spartan-ng/helm/badge'
import { cn } from '../../../shared/utils/cn'
import { LongTextComponent } from '../../../components/long-text/long-text.component'
import {
  DataTableComponent,
  type DataTableFilterConfig,
} from '../../../shared/data-table/data-table.component'
import { callTypes, roles, statuses } from '../data/data'
import type { User } from '../data/schema'
import { UsersStoreService } from '../store/users-store.service'
import { UsersBulkActionsComponent } from './users-bulk-actions.component'
import { usersColumns } from './users-columns'
import { UsersRowActionsComponent } from './users-row-actions.component'

/**
 * Users table: the second `DataTableComponent` consumer.
 *
 * Wires the columns, seeded store rows, URL-synced state
 * (`username`/`status[]`/`role[]`/`page`/`pageSize` via `urlSync`),
 * status + role faceted filters (role with icons), and the
 * username/fullName/email/phone/status/role/actions cell templates from
 * `users-columns.tsx`. The toolbar search is scoped to the `username`
 * column (`searchKey`, global filter disabled) exactly like the source
 * `users-table.tsx`. The projected `app-users-bulk-actions` receives the
 * table engine through the template reference (`#table.engine`).
 *
 * Facet icons are consumer-registered ng-icon names (Task 15 ledger note):
 * provided here so both the faceted filters and the role cells resolve them.
 */
@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [
    NgIcon,
    HlmBadgeImports,
    DataTableComponent,
    LongTextComponent,
    UsersBulkActionsComponent,
    UsersRowActionsComponent,
  ],
  providers: [
    provideIcons({
      lucideCreditCard,
      lucideShield,
      lucideUserCheck,
      lucideUsers,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-data-table
      #table
      [columns]="columns"
      [data]="store.users()"
      [urlSync]="true"
      searchPlaceholder="Filter users..."
      searchKey="username"
      selectionCellClass="inset-s-0 z-10 rounded-tl-[inherit] max-md:sticky"
      [filterConfigs]="filterConfigs"
      [cellTemplates]="{
        username: usernameTpl,
        fullName: fullNameTpl,
        email: emailTpl,
        phoneNumber: phoneTpl,
        status: statusTpl,
        role: roleTpl,
        actions: actionsTpl,
      }"
      entityName="user"
    >
      <app-users-bulk-actions [engine]="table.engine" />
    </app-data-table>

    <ng-template #usernameTpl let-row>
      <app-long-text className="max-w-36 ps-3">{{
        row.username
      }}</app-long-text>
    </ng-template>

    <ng-template #fullNameTpl let-row>
      <app-long-text className="max-w-36">
        {{ row.firstName }} {{ row.lastName }}
      </app-long-text>
    </ng-template>

    <ng-template #emailTpl let-row>
      <div class="w-fit ps-2 text-nowrap">{{ row.email }}</div>
    </ng-template>

    <ng-template #phoneTpl let-row>
      <div>{{ row.phoneNumber }}</div>
    </ng-template>

    <ng-template #statusTpl let-row>
      <div class="flex space-x-2">
        <span hlmBadge variant="outline" [class]="statusClass(row)">
          {{ row.status }}
        </span>
      </div>
    </ng-template>

    <ng-template #roleTpl let-row>
      <div class="flex items-center gap-x-2">
        @if (roleIcon(row); as icon) {
          <ng-icon
            [name]="icon"
            aria-hidden="true"
            class="text-muted-foreground size-4"
          />
        }
        <span class="text-sm capitalize">{{ row.role }}</span>
      </div>
    </ng-template>

    <ng-template #actionsTpl let-row>
      <app-users-row-actions [row]="row" />
    </ng-template>
  `,
})
export class UsersTableComponent {
  protected readonly store = inject(UsersStoreService)

  protected readonly columns = usersColumns

  protected readonly filterConfigs: DataTableFilterConfig[] = [
    { columnId: 'status', title: 'Status', options: statuses },
    { columnId: 'role', title: 'Role', options: roles },
  ]

  protected statusClass(row: User): string {
    return cn('capitalize', callTypes[row.status])
  }

  protected roleIcon(row: User): string | null {
    return roles.find((option) => option.value === row.role)?.icon ?? null
  }
}
