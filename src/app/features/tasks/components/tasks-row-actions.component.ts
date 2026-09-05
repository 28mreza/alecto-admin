import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideEllipsis, lucideTrash2 } from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu'
import { taskLabels } from '../data/data'
import type { Task, TaskLabel } from '../data/schema'
import { TasksStoreService } from '../store/tasks-store.service'

/**
 * Per-row actions dropdown for the tasks table.
 *
 * Ported from `data-table-row-actions.tsx`: Edit opens the update drawer,
 * Make a copy / Favorite stay disabled, Labels opens a radio submenu, Delete
 * opens the delete confirm. The source's Labels radio group is a visual
 * no-op; here selecting a label calls `store.setLabel` (functional and
 * harmless).
 */
@Component({
  selector: 'app-tasks-row-actions',
  standalone: true,
  imports: [NgIcon, HlmButtonImports, HlmDropdownMenuImports],
  providers: [provideIcons({ lucideEllipsis, lucideTrash2 })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      hlmBtn
      variant="ghost"
      type="button"
      class="data-[state=open]:bg-muted flex h-8 w-8 p-0"
      hlmDropdownMenuTrigger
      [hlmDropdownMenuTrigger]="menu"
      [attr.aria-label]="'Open menu for task ' + row().id"
    >
      <ng-icon name="lucideEllipsis" aria-hidden="true" class="h-4 w-4" />
      <span class="sr-only">Open menu</span>
    </button>

    <ng-template #menu>
      <div hlmDropdownMenu class="w-40" align="end">
        <button type="button" hlmDropdownMenuItem (triggered)="onEdit()">
          Edit
        </button>
        <button type="button" hlmDropdownMenuItem disabled>Make a copy</button>
        <button type="button" hlmDropdownMenuItem disabled>Favorite</button>
        <hr hlmDropdownMenuSeparator />
        <button
          type="button"
          hlmDropdownMenuItem
          hlmDropdownMenuSubTrigger
          [hlmDropdownMenuSubTrigger]="labelsMenu"
        >
          Labels
        </button>
        <hr hlmDropdownMenuSeparator />
        <button type="button" hlmDropdownMenuItem (triggered)="onDelete()">
          Delete
          <span hlmDropdownMenuShortcut>
            <ng-icon name="lucideTrash2" aria-hidden="true" class="size-4" />
          </span>
        </button>
      </div>
    </ng-template>

    <ng-template #labelsMenu>
      <div hlmDropdownMenuSub>
        @for (label of labels; track label.value) {
          <button
            type="button"
            hlmDropdownMenuRadio
            [checked]="row().label === label.value"
            (triggered)="onSelectLabel(label.value)"
          >
            {{ label.label }}
          </button>
        }
      </div>
    </ng-template>
  `,
})
export class TasksRowActionsComponent {
  readonly row = input.required<Task>()

  protected readonly labels = taskLabels

  private readonly store = inject(TasksStoreService)

  protected onEdit(): void {
    this.store.setCurrentRow(this.row())
    this.store.setOpen('update')
  }

  protected onDelete(): void {
    this.store.setCurrentRow(this.row())
    this.store.setOpen('delete')
  }

  protected onSelectLabel(label: string): void {
    this.store.setLabel(this.row().id, label as TaskLabel)
  }
}
