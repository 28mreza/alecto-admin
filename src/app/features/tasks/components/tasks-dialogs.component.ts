import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { TasksStoreService } from '../store/tasks-store.service'
import { TasksDeleteDialogComponent } from './tasks-delete-dialog.component'
import { TasksImportDialogComponent } from './tasks-import-dialog.component'
import { TasksMutateDrawerComponent } from './tasks-mutate-drawer.component'

/**
 * Dialog host for the tasks page.
 *
 * Ported from `tasks-dialogs.tsx`: renders the create drawer, the import
 * dialog, and — while a row is selected — the update drawer plus the delete
 * confirm, all driven by `store.open` (toggle semantics) and
 * `store.currentRow`. Closing any overlay resets the store state; the update
 * drawer and delete dialog additionally clear the current row (the source
 * defers that with a 500ms timeout for its exit animation — here the
 * close-on-`closed`-event covers it without a timer).
 */
@Component({
  selector: 'app-tasks-dialogs',
  standalone: true,
  imports: [
    TasksMutateDrawerComponent,
    TasksImportDialogComponent,
    TasksDeleteDialogComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-tasks-mutate-drawer
      [open]="store.open() === 'create'"
      (closed)="store.setOpen('create')"
    />

    <app-tasks-import-dialog
      [open]="store.open() === 'import'"
      (closed)="store.setOpen('import')"
    />

    @if (store.currentRow(); as row) {
      <app-tasks-mutate-drawer
        [open]="store.open() === 'update'"
        [currentRow]="row"
        (closed)="onUpdateClosed()"
      />
      <app-tasks-delete-dialog
        [open]="store.open() === 'delete'"
        [row]="row"
        (closed)="onDeleteClosed()"
      />
    }
  `,
})
export class TasksDialogsComponent {
  protected readonly store = inject(TasksStoreService)

  protected onUpdateClosed(): void {
    this.store.setOpen('update')
    this.store.setCurrentRow(null)
  }

  protected onDeleteClosed(): void {
    this.store.setOpen('delete')
    this.store.setCurrentRow(null)
  }
}
