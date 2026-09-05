import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import {
  lucideMail,
  lucideTrash2,
  lucideUserCheck,
  lucideUserX,
} from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip'
import { ToastService } from '../../../core/services/toast.service'
import type { TableEngine } from '../../../shared/data-table/table-engine'
import { sleep } from '../../../shared/utils/sleep'
import type { User } from '../data/schema'
import { UsersMultiDeleteDialogComponent } from './users-multi-delete-dialog.component'

/**
 * Bulk actions projected into the data-table's floating selection bar.
 *
 * Ported from `data-table-bulk-actions.tsx`: invite / activate /
 * deactivate icon buttons plus the destructive delete button opening the
 * multi-delete confirm, all backed by `ToastService.promise` with the
 * source's exact messages. Receives the table `engine` from
 * `UsersTableComponent` via `[engine]="table.engine"`.
 */
@Component({
  selector: 'app-users-bulk-actions',
  standalone: true,
  imports: [
    NgIcon,
    HlmButtonImports,
    HlmTooltipImports,
    UsersMultiDeleteDialogComponent,
  ],
  providers: [
    provideIcons({ lucideMail, lucideTrash2, lucideUserCheck, lucideUserX }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      hlmBtn
      variant="outline"
      size="icon"
      type="button"
      class="size-8"
      (click)="onBulkInvite()"
      aria-label="Invite selected users"
      title="Invite selected users"
      [hlmTooltip]="inviteTip"
    >
      <ng-icon name="lucideMail" aria-hidden="true" />
      <span class="sr-only">Invite selected users</span>
    </button>
    <ng-template #inviteTip>Invite selected users</ng-template>

    <button
      hlmBtn
      variant="outline"
      size="icon"
      type="button"
      class="size-8"
      (click)="onBulkStatusChange('active')"
      aria-label="Activate selected users"
      title="Activate selected users"
      [hlmTooltip]="activateTip"
    >
      <ng-icon name="lucideUserCheck" aria-hidden="true" />
      <span class="sr-only">Activate selected users</span>
    </button>
    <ng-template #activateTip>Activate selected users</ng-template>

    <button
      hlmBtn
      variant="outline"
      size="icon"
      type="button"
      class="size-8"
      (click)="onBulkStatusChange('inactive')"
      aria-label="Deactivate selected users"
      title="Deactivate selected users"
      [hlmTooltip]="deactivateTip"
    >
      <ng-icon name="lucideUserX" aria-hidden="true" />
      <span class="sr-only">Deactivate selected users</span>
    </button>
    <ng-template #deactivateTip>Deactivate selected users</ng-template>

    <button
      hlmBtn
      variant="destructive"
      size="icon"
      type="button"
      class="size-8"
      (click)="showDeleteConfirm.set(true)"
      aria-label="Delete selected users"
      title="Delete selected users"
      [hlmTooltip]="deleteTip"
    >
      <ng-icon name="lucideTrash2" aria-hidden="true" />
      <span class="sr-only">Delete selected users</span>
    </button>
    <ng-template #deleteTip>Delete selected users</ng-template>

    <app-users-multi-delete-dialog
      [open]="showDeleteConfirm()"
      [selectedIds]="selectedIds()"
      (closed)="showDeleteConfirm.set(false)"
      (deleted)="onMultiDeleted()"
    />
  `,
})
export class UsersBulkActionsComponent {
  readonly engine = input.required<TableEngine<User>>()

  protected readonly showDeleteConfirm = signal(false)

  private readonly toast = inject(ToastService)

  protected selectedIds(): string[] {
    return this.engine()
      .selectedRows()
      .map((row) => row.id)
  }

  protected onBulkStatusChange(status: 'active' | 'inactive'): void {
    const count = this.selectedIds().length
    this.toast.promise(sleep(2000), {
      loading: `${status === 'active' ? 'Activating' : 'Deactivating'} users...`,
      success: () => {
        this.engine().resetRowSelection()
        return `${status === 'active' ? 'Activated' : 'Deactivated'} ${count} user${count > 1 ? 's' : ''}`
      },
      error: `Error ${status === 'active' ? 'activating' : 'deactivating'} users`,
    })
    this.engine().resetRowSelection()
  }

  protected onBulkInvite(): void {
    const count = this.selectedIds().length
    this.toast.promise(sleep(2000), {
      loading: 'Inviting users...',
      success: () => {
        this.engine().resetRowSelection()
        return `Invited ${count} user${count > 1 ? 's' : ''}`
      },
      error: 'Error inviting users',
    })
    this.engine().resetRowSelection()
  }

  protected onMultiDeleted(): void {
    this.engine().resetRowSelection()
    this.showDeleteConfirm.set(false)
  }
}
