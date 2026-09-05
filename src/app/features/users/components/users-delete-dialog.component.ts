import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  input,
  output,
  runInInjectionContext,
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
import { showSubmittedData } from '../../../shared/utils/show-submitted-data'
import type { User } from '../data/schema'
import { UsersStoreService } from '../store/users-store.service'

/**
 * Single-user delete confirmation.
 *
 * Ported from `users-delete-dialog.tsx`: destructive confirm requiring the
 * username to be typed, with the "Warning!" alert. Confirming deletes the
 * row via the store, clears the current row and toasts the deleted user.
 */
@Component({
  selector: 'app-users-delete-dialog',
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
              Delete User
            </span>
          </h2>
          <div hlmAlertDialogDescription>
            <form
              id="users-delete-form"
              (ngSubmit)="onConfirm()"
              class="space-y-4"
            >
              <p class="mb-2">
                Are you sure you want to delete
                <span class="font-bold">{{ row()?.username }}</span
                >?
                <br />
                This action will permanently remove the user with the role of
                <span class="font-bold">
                  {{ roleLabel() }}
                </span>
                from the system. This cannot be undone.
              </p>

              <label hlmLabel class="my-2" for="users-delete-input">
                Username:
                <input
                  hlmInput
                  id="users-delete-input"
                  [ngModel]="value()"
                  (ngModelChange)="value.set($event)"
                  [ngModelOptions]="{ standalone: true }"
                  placeholder="Enter username to confirm deletion."
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
            form="users-delete-form"
            [disabled]="!isConfirmed()"
          >
            Delete
          </button>
        </div>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>
  `,
})
export class UsersDeleteDialogComponent {
  readonly open = input(false)
  readonly row = input<User | null>(null)
  readonly closed = output<void>()

  protected readonly value = signal('')

  private readonly store = inject(UsersStoreService)
  private readonly injector = inject(Injector)

  protected isConfirmed(): boolean {
    const row = this.row()
    return row !== null && this.value().trim() === row.username
  }

  protected roleLabel(): string {
    return (this.row()?.role ?? '').toUpperCase()
  }

  protected onStateChanged(state: BrnDialogState): void {
    if (state === 'closed') {
      this.value.set('')
      this.closed.emit()
    }
  }

  protected onConfirm(): void {
    const row = this.row()
    if (!row || !this.isConfirmed()) return
    this.store.deleteUser(row.id)
    this.store.setCurrentRow(null)
    // showSubmittedData() injects ToastService, so it must run inside an
    // injection context (submit handlers are not one).
    runInInjectionContext(this.injector, () =>
      showSubmittedData(row, 'The following user has been deleted:')
    )
    this.value.set('')
    this.closed.emit()
  }
}
