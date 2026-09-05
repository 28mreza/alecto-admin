import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import {
  lucideArrowDown,
  lucideArrowRight,
  lucideArrowUp,
  lucideCircle,
  lucideCircleAlert,
  lucideCircleCheck,
  lucideCircleHelp,
  lucideCircleOff,
  lucideTimer,
} from '@ng-icons/lucide'
import { HlmBadgeImports } from '@spartan-ng/helm/badge'
import {
  DataTableComponent,
  type DataTableFilterConfig,
} from '../../../shared/data-table/data-table.component'
import type { GlobalFilterFn } from '../../../shared/data-table/table-engine'
import { taskLabel, taskPriorities, taskStatuses } from '../data/data'
import type { Task } from '../data/schema'
import { TasksStoreService } from '../store/tasks-store.service'
import { TasksBulkActionsComponent } from './tasks-bulk-actions.component'
import { tasksColumns } from './tasks-columns'
import { TasksRowActionsComponent } from './tasks-row-actions.component'

/**
 * Case-insensitive id/title matcher (mirrors the source table's
 * `globalFilterFn` in `tasks-table.tsx`).
 */
export const tasksGlobalFilterFn: GlobalFilterFn<Task> = (row, filter) => {
  const needle = filter.trim().toLowerCase()
  if (!needle) return true
  return (
    row.id.toLowerCase().includes(needle) ||
    row.title.toLowerCase().includes(needle)
  )
}

/**
 * Tasks table: the first `DataTableComponent` consumer.
 *
 * Wires the columns, seeded store rows, URL-synced state
 * (`filter`/`status[]`/`priority[]`/`page`/`pageSize` via `urlSync`),
 * status+priority faceted filters with icons, and the title/status/priority
 * /actions cell templates from `tasks-columns.tsx`. The projected
 * `app-tasks-bulk-actions` receives the table engine through the template
 * reference (`#table.engine` — no DataTable extension needed for that).
 *
 * Facet icons are consumer-registered ng-icon names (Task 15 ledger note):
 * provided here so both the faceted filters and the cells resolve them.
 */
@Component({
  selector: 'app-tasks-table',
  standalone: true,
  imports: [
    NgIcon,
    HlmBadgeImports,
    DataTableComponent,
    TasksBulkActionsComponent,
    TasksRowActionsComponent,
  ],
  providers: [
    provideIcons({
      lucideArrowDown,
      lucideArrowRight,
      lucideArrowUp,
      lucideCircle,
      lucideCircleAlert,
      lucideCircleCheck,
      lucideCircleHelp,
      lucideCircleOff,
      lucideTimer,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-data-table
      #table
      [columns]="columns"
      [data]="store.tasks()"
      [urlSync]="true"
      searchPlaceholder="Filter by title or ID..."
      tableClass="min-w-xl"
      [filterConfigs]="filterConfigs"
      [cellTemplates]="{
        title: titleTpl,
        status: statusTpl,
        priority: priorityTpl,
        actions: actionsTpl,
      }"
      [globalFilterFn]="globalFilterFn"
      entityName="task"
    >
      <app-tasks-bulk-actions [engine]="table.engine" />
    </app-data-table>

    <ng-template #titleTpl let-row>
      <div class="flex space-x-2">
        <span hlmBadge variant="outline">{{ labelOf(row) }}</span>
        <span class="truncate font-medium">{{ row.title }}</span>
      </div>
    </ng-template>

    <ng-template #statusTpl let-row>
      <div class="flex w-25 items-center gap-2">
        @if (statusOf(row).icon) {
          <ng-icon
            [name]="statusOf(row).icon ?? ''"
            aria-hidden="true"
            class="text-muted-foreground size-4"
          />
        }
        <span>{{ statusOf(row).label }}</span>
      </div>
    </ng-template>

    <ng-template #priorityTpl let-row>
      <div class="flex items-center gap-2">
        @if (priorityOf(row).icon) {
          <ng-icon
            [name]="priorityOf(row).icon ?? ''"
            aria-hidden="true"
            class="text-muted-foreground size-4"
          />
        }
        <span>{{ priorityOf(row).label }}</span>
      </div>
    </ng-template>

    <ng-template #actionsTpl let-row>
      <app-tasks-row-actions [row]="row" />
    </ng-template>
  `,
})
export class TasksTableComponent {
  protected readonly store = inject(TasksStoreService)

  protected readonly columns = tasksColumns
  protected readonly globalFilterFn = tasksGlobalFilterFn

  protected readonly filterConfigs: DataTableFilterConfig[] = [
    { columnId: 'status', title: 'Status', options: taskStatuses },
    { columnId: 'priority', title: 'Priority', options: taskPriorities },
  ]

  protected labelOf(row: Task): string {
    return taskLabel(row.label)
  }

  protected statusOf(row: Task): { label: string; icon?: string } {
    const found = taskStatuses.find((option) => option.value === row.status)
    return found ?? { label: row.status }
  }

  protected priorityOf(row: Task): { label: string; icon?: string } {
    const found = taskPriorities.find((option) => option.value === row.priority)
    return found ?? { label: row.priority }
  }
}
