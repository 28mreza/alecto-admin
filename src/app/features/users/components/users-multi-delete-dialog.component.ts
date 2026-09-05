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
import { UsersStoreService } from '../store/users-store.service'

export const USERS_DELETE_CONFIRM_WORD = 'DELETE'

/**
 * Pure multi-delete gate (mirrors the source `users-multi-delete-dialog.tsx`
 * confirm word). Exported for focused unit tests.
 */
export function isUsersMultiDeleteConfirmed(value: string): boolean {
  return value.trim() === USERS_DELETE_CONFIRM_WORD
}

/**
 * Multi-delete confirmation for the users bulk actions.
 *
 * Ported from `users-multi-delete-dialog.tsx`: destructive confirm dialog
 * requiring the word DELETE, with the "Warning!" alert. Confirming deletes
 * the selected rows via the store and reports through
 * `ToastService.promise`.
 */
@Component({
  selector: 'app-users-multi-delete-dialog',
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
              {{ selectedIds().length > 1 ? 'users' : 'user' }}
            </span>
          </h2>
          <div hlmAlertDialogDescription>
            <form
              id="users-multi-delete-form"
              (ngSubmit)="onConfirm()"
              class="space-y-4"
            >
              <p class="mb-2">
                Are you sure you want to delete the selected users? <br />
                This action cannot be undone.
              </p>

              <label
                hlmLabel
                class="my-4 flex flex-col items-start gap-1.5"
                for="users-multi-delete-input"
              >
                <span>Confirm by typing "{{ confirmWord }}":</span>
                <input
                  hlmInput
                  id="users-multi-delete-input"
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
            form="users-multi-delete-form"
            [disabled]="!isConfirmed()"
          >
            Delete
          </button>
        </div>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>
  `,
})
export class UsersMultiDeleteDialogComponent {
  readonly open = input(false)
  readonly selectedIds = input<string[]>([])
  readonly closed = output<void>()
  readonly deleted = output<string[]>()

  protected readonly confirmWord = USERS_DELETE_CONFIRM_WORD
  protected readonly value = signal('')

  private readonly store = inject(UsersStoreService)
  private readonly toast = inject(ToastService)

  protected isConfirmed(): boolean {
    return isUsersMultiDeleteConfirmed(this.value())
  }

  protected onStateChanged(state: BrnDialogState): void {
    if (state === 'closed') {
      this.value.set('')
      this.closed.emit()
    }
  }

  protected onValueChange(next: string): void {
    this.value.set(next)
  }

  protected onConfirm(): void {
    if (!this.isConfirmed()) {
      this.toast.error(`Please type "${USERS_DELETE_CONFIRM_WORD}" to confirm.`)
      return
    }
    const ids = [...this.selectedIds()]
    this.store.deleteMany(ids)
    this.value.set('')
    this.toast.promise(sleep(2000), {
      loading: 'Deleting users...',
      success: () =>
        `Deleted ${ids.length} ${ids.length > 1 ? 'users' : 'user'}`,
      error: 'Error',
    })
    this.deleted.emit(ids)
  }
}
