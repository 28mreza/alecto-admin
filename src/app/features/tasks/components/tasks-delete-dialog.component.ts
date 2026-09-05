import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  input,
  output,
  runInInjectionContext,
} from '@angular/core'
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import type { BrnDialogState } from '@spartan-ng/brain/dialog'
import { showSubmittedData } from '../../../shared/utils/show-submitted-data'
import type { Task } from '../data/schema'
import { TasksStoreService } from '../store/tasks-store.service'

/**
 * Single-task delete confirmation.
 *
 * Ported from the `ConfirmDialog` branch of `tasks-dialogs.tsx`:
 * destructive, `max-w-md`, title `Delete this task: {id} ?` with the ID in
 * the description. Confirming deletes the row via the store, clears the
 * current row and toasts the deleted task.
 */
@Component({
  selector: 'app-tasks-delete-dialog',
  standalone: true,
  imports: [HlmAlertDialogImports, HlmButtonImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <hlm-alert-dialog
      [state]="open() ? 'open' : 'closed'"
      (stateChanged)="onStateChanged($event)"
    >
      <hlm-alert-dialog-content *hlmAlertDialogPortal class="max-w-md">
        <div hlmAlertDialogHeader class="text-start">
          <h2 hlmAlertDialogTitle>Delete this task: {{ row()?.id }} ?</h2>
          <div hlmAlertDialogDescription>
            <div>
              You are about to delete a task with the ID
              <strong>{{ row()?.id }}</strong
              >. <br />
              This action cannot be undone.
            </div>
          </div>
        </div>
        <div hlmAlertDialogFooter>
          <button hlmAlertDialogCancel type="button">Cancel</button>
          <button
            hlmAlertDialogAction
            variant="destructive"
            type="button"
            (click)="onConfirm()"
          >
            Delete
          </button>
        </div>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>
  `,
})
export class TasksDeleteDialogComponent {
  readonly open = input(false)
  readonly row = input<Task | null>(null)
  readonly closed = output<void>()

  private readonly store = inject(TasksStoreService)
  private readonly injector = inject(Injector)

  protected onStateChanged(state: BrnDialogState): void {
    if (state === 'closed') this.closed.emit()
  }

  protected onConfirm(): void {
    const row = this.row()
    if (!row) {
      this.closed.emit()
      return
    }
    this.store.deleteTask(row.id)
    this.store.setCurrentRow(null)
    // showSubmittedData() injects ToastService, so it must run inside an
    // injection context (click handlers are not one).
    runInInjectionContext(this.injector, () =>
      showSubmittedData(row, 'The following task has been deleted:')
    )
    this.closed.emit()
  }
}
