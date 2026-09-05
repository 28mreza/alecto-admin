import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { UsersStoreService } from '../store/users-store.service'
import { UsersActionDialogComponent } from './users-action-dialog.component'
import { UsersDeleteDialogComponent } from './users-delete-dialog.component'
import { UsersInviteDialogComponent } from './users-invite-dialog.component'

/**
 * Dialog host for the users page.
 *
 * Ported from `users-dialogs.tsx`: renders the add and invite dialogs, and
 * — while a row is selected — the edit dialog plus the delete confirm, all
 * driven by `store.open` (toggle semantics) and `store.currentRow`.
 * Closing any overlay resets the store state; the edit dialog and delete
 * dialog additionally clear the current row (the source defers that with a
 * 500ms timeout for its exit animation — here the close-on-`closed`-event
 * covers it without a timer, mirroring `TasksDialogsComponent`).
 */
@Component({
  selector: 'app-users-dialogs',
  standalone: true,
  imports: [
    UsersActionDialogComponent,
    UsersDeleteDialogComponent,
    UsersInviteDialogComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-users-action-dialog
      [open]="store.open() === 'add'"
      (closed)="store.setOpen('add')"
    />

    <app-users-invite-dialog
      [open]="store.open() === 'invite'"
      (closed)="store.setOpen('invite')"
    />

    @if (store.currentRow(); as row) {
      <app-users-action-dialog
        [open]="store.open() === 'edit'"
        [currentRow]="row"
        (closed)="onEditClosed()"
      />
      <app-users-delete-dialog
        [open]="store.open() === 'delete'"
        [row]="row"
        (closed)="onDeleteClosed()"
      />
    }
  `,
})
export class UsersDialogsComponent {
  protected readonly store = inject(UsersStoreService)

  protected onEditClosed(): void {
    this.store.setOpen('edit')
    this.store.setCurrentRow(null)
  }

  protected onDeleteClosed(): void {
    this.store.setOpen('delete')
    this.store.setCurrentRow(null)
  }
}
