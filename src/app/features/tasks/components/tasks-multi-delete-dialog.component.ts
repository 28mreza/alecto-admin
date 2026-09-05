import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideTriangleAlert } from '@ng-icons/lucide'
import { HlmAlertImports } from '@spartan-ng/helm/alert'
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmLabelImports } from '@spartan-ng/helm/label'
import type { BrnDialogState } from '@spartan-ng/brain/dialog'
import { ToastService } from '../../../core/services/toast.service'
import { sleep } from '../../../shared/utils/sleep'
import { TasksStoreService } from '../store/tasks-store.service'

export const TASKS_DELETE_CONFIRM_WORD = 'DELETE'

/**
 * Multi-delete confirmation for the tasks bulk actions.
 *
 * Ported from `tasks-multi-delete-dialog.tsx`: destructive confirm dialog
 * requiring the word DELETE, with the "Warning!" alert. Confirming deletes
 * the selected rows via the store and reports through `ToastService.promise`.
 */
@Component({
  selector: 'app-tasks-multi-delete-dialog',
  standalone: true,
  imports: [
    FormsModule,
    NgIcon,
    HlmAlertImports,
    HlmAlertDialogImports,
    HlmButtonImports,
    HlmInputImports,
    HlmLabelImports,
  ],
  providers: [provideIcons({ lucideTriangleAlert })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <hlm-alert-dialog
      [state]="open() ? 'open' : 'closed'"
      (stateChanged)="onStateChanged($event)"
    >
      <hlm-alert-dialog-content *hlmAlertDialogPortal>
        <div hlmAlertDialogHeader class="text-start">
          <h2 hlmAlertDialogTitle>
            <span class="text-destructive">
              <ng-icon
                name="lucideTriangleAlert"
                aria-hidden="true"
                class="stroke-destructive me-1 inline-block"
              />
              Delete {{ selectedIds().length }}
              {{ selectedIds().length > 1 ? 'tasks' : 'task' }}
            </span>
          </h2>
          <div hlmAlertDialogDescription>
            <form
              id="tasks-multi-delete-form"
              (ngSubmit)="onConfirm()"
              class="space-y-4"
            >
              <p class="mb-2">
                Are you sure you want to delete the selected tasks? <br />
                This action cannot be undone.
              </p>

              <label
                hlmLabel
                class="my-4 flex flex-col items-start gap-1.5"
                for="tasks-multi-delete-input"
              >
                <span>Confirm by typing "{{ confirmWord }}":</span>
                <input
                  hlmInput
                  id="tasks-multi-delete-input"
                  [ngModel]="value()"
                  (ngModelChange)="onValueChange($event)"
                  [ngModelOptions]="{ standalone: true }"
                  [placeholder]="
                    'Type &quot;' + confirmWord + '&quot; to confirm.'
                  "
                />
              </label>

              <div hlmAlert variant="destructive">
                <h5 hlmAlertTitle>Warning!</h5>
                <div hlmAlertDescription>
                  Please be careful, this operation can not be rolled back.
                </div>
              </div>
            </form>
          </div>
        </div>
        <div hlmAlertDialogFooter>
          <button hlmAlertDialogCancel type="button">Cancel</button>
          <button
            hlmAlertDialogAction
            variant="destructive"
            type="submit"
            form="tasks-multi-delete-form"
            [disabled]="!isConfirmed()"
          >
            Delete
          </button>
        </div>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>
  `,
})
export class TasksMultiDeleteDialogComponent {
  readonly open = input(false)
  readonly selectedIds = input<string[]>([])
  readonly closed = output<void>()
  readonly deleted = output<string[]>()

  protected readonly confirmWord = TASKS_DELETE_CONFIRM_WORD
  protected readonly value = signal('')
  protected readonly isConfirmed = signal(false)

  private readonly store = inject(TasksStoreService)
  private readonly toast = inject(ToastService)

  protected onStateChanged(state: BrnDialogState): void {
    if (state === 'closed') {
      this.value.set('')
      this.isConfirmed.set(false)
      this.closed.emit()
    }
  }

  protected onValueChange(next: string): void {
    this.value.set(next)
    this.isConfirmed.set(next.trim() === TASKS_DELETE_CONFIRM_WORD)
  }

  protected onConfirm(): void {
    if (!this.isConfirmed()) {
      this.toast.error(`Please type "${TASKS_DELETE_CONFIRM_WORD}" to confirm.`)
      return
    }
    const ids = [...this.selectedIds()]
    this.store.deleteMany(ids)
    this.value.set('')
    this.isConfirmed.set(false)
    this.toast.promise(sleep(2000), {
      loading: 'Deleting tasks...',
      success: () =>
        `Deleted ${ids.length} ${ids.length > 1 ? 'tasks' : 'task'}`,
      error: 'Error',
    })
    this.deleted.emit(ids)
  }
}
