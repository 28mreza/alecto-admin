import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import {
  lucideArrowUpDown,
  lucideCircleArrowUp,
  lucideDownload,
  lucideTrash2,
} from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu'
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip'
import { ToastService } from '../../../core/services/toast.service'
import type { TableEngine } from '../../../shared/data-table/table-engine'
import { sleep } from '../../../shared/utils/sleep'
import { taskPriorities, taskStatuses } from '../data/data'
import type { Task } from '../data/schema'
import { TasksMultiDeleteDialogComponent } from './tasks-multi-delete-dialog.component'

/**
 * Bulk actions projected into the data-table's floating selection bar.
 *
 * Ported from `data-table-bulk-actions.tsx`: status / priority dropdowns,
 * export and delete icon buttons (each with a tooltip), all backed by
 * `ToastService.promise` with the source's exact messages. Receives the
 * table `engine` from `TasksTableComponent` via `[engine]="table.engine"`.
 */
@Component({
  selector: 'app-tasks-bulk-actions',
  standalone: true,
  imports: [
    NgIcon,
    HlmButtonImports,
    HlmDropdownMenuImports,
    HlmTooltipImports,
    TasksMultiDeleteDialogComponent,
  ],
  providers: [
    provideIcons({
      lucideArrowUpDown,
      lucideCircleArrowUp,
      lucideDownload,
      lucideTrash2,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      hlmBtn
      variant="outline"
      size="icon"
      type="button"
      class="size-8"
      hlmDropdownMenuTrigger
      [hlmDropdownMenuTrigger]="statusMenu"
      aria-label="Update status"
      title="Update status"
      [hlmTooltip]="statusTip"
    >
      <ng-icon name="lucideCircleArrowUp" aria-hidden="true" />
      <span class="sr-only">Update status</span>
    </button>
    <ng-template #statusTip>Update status</ng-template>
    <ng-template #statusMenu>
      <div hlmDropdownMenu>
        @for (status of statuses; track status.value) {
          <button
            type="button"
            hlmDropdownMenuItem
            (triggered)="onBulkStatus(status.value)"
          >
            <ng-icon
              [name]="status.icon ?? ''"
              aria-hidden="true"
              class="text-muted-foreground size-4"
            />
            {{ status.label }}
          </button>
        }
      </div>
    </ng-template>

    <button
      hlmBtn
      variant="outline"
      size="icon"
      type="button"
      class="size-8"
      hlmDropdownMenuTrigger
      [hlmDropdownMenuTrigger]="priorityMenu"
      aria-label="Update priority"
      title="Update priority"
      [hlmTooltip]="priorityTip"
    >
      <ng-icon name="lucideArrowUpDown" aria-hidden="true" />
      <span class="sr-only">Update priority</span>
    </button>
    <ng-template #priorityTip>Update priority</ng-template>
    <ng-template #priorityMenu>
      <div hlmDropdownMenu>
        @for (priority of priorities; track priority.value) {
          <button
            type="button"
            hlmDropdownMenuItem
            (triggered)="onBulkPriority(priority.value)"
          >
            <ng-icon
              [name]="priority.icon ?? ''"
              aria-hidden="true"
              class="text-muted-foreground size-4"
            />
            {{ priority.label }}
          </button>
        }
      </div>
    </ng-template>

    <button
      hlmBtn
      variant="outline"
      size="icon"
      type="button"
      class="size-8"
      (click)="onBulkExport()"
      aria-label="Export tasks"
      title="Export tasks"
      [hlmTooltip]="exportTip"
    >
      <ng-icon name="lucideDownload" aria-hidden="true" />
      <span class="sr-only">Export tasks</span>
    </button>
    <ng-template #exportTip>Export tasks</ng-template>

    <button
      hlmBtn
      variant="destructive"
      size="icon"
      type="button"
      class="size-8"
      (click)="showDeleteConfirm.set(true)"
      aria-label="Delete selected tasks"
      title="Delete selected tasks"
      [hlmTooltip]="deleteTip"
    >
      <ng-icon name="lucideTrash2" aria-hidden="true" />
      <span class="sr-only">Delete selected tasks</span>
    </button>
    <ng-template #deleteTip>Delete selected tasks</ng-template>

    <app-tasks-multi-delete-dialog
      [open]="showDeleteConfirm()"
      [selectedIds]="selectedIds()"
      (closed)="showDeleteConfirm.set(false)"
      (deleted)="onMultiDeleted()"
    />
  `,
})
export class TasksBulkActionsComponent {
  readonly engine = input.required<TableEngine<Task>>()

  protected readonly statuses = taskStatuses
  protected readonly priorities = taskPriorities
  protected readonly showDeleteConfirm = signal(false)

  private readonly toast = inject(ToastService)

  protected selectedIds(): string[] {
    return this.engine()
      .selectedRows()
      .map((row) => row.id)
  }

  protected onBulkStatus(status: string): void {
    const count = this.selectedIds().length
    this.toast.promise(sleep(2000), {
      loading: 'Updating status...',
      success: () => {
        this.engine().resetRowSelection()
        return `Status updated to "${status}" for ${count} task${count > 1 ? 's' : ''}.`
      },
      error: 'Error',
    })
    this.engine().resetRowSelection()
  }

  protected onBulkPriority(priority: string): void {
    const count = this.selectedIds().length
    this.toast.promise(sleep(2000), {
      loading: 'Updating priority...',
      success: () => {
        this.engine().resetRowSelection()
        return `Priority updated to "${priority}" for ${count} task${count > 1 ? 's' : ''}.`
      },
      error: 'Error',
    })
    this.engine().resetRowSelection()
  }

  protected onBulkExport(): void {
    const count = this.selectedIds().length
    this.toast.promise(sleep(2000), {
      loading: 'Exporting tasks...',
      success: () => {
        this.engine().resetRowSelection()
        return `Exported ${count} task${count > 1 ? 's' : ''} to CSV.`
      },
      error: 'Error',
    })
    this.engine().resetRowSelection()
  }

  protected onMultiDeleted(): void {
    this.engine().resetRowSelection()
    this.showDeleteConfirm.set(false)
  }
}
