import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideEllipsis, lucideTrash2, lucideUserPen } from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu'
import type { User } from '../data/schema'
import { UsersStoreService } from '../store/users-store.service'

/**
 * Per-row actions dropdown for the users table.
 *
 * Ported from `data-table-row-actions.tsx`: Edit opens the edit dialog and
 * Delete opens the delete confirm, both via the store's `currentRow` +
 * `open` state.
 */
@Component({
  selector: 'app-users-row-actions',
  standalone: true,
  imports: [NgIcon, HlmButtonImports, HlmDropdownMenuImports],
  providers: [provideIcons({ lucideEllipsis, lucideTrash2, lucideUserPen })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      hlmBtn
      variant="ghost"
      type="button"
      class="data-[state=open]:bg-muted flex h-8 w-8 p-0"
      hlmDropdownMenuTrigger
      [hlmDropdownMenuTrigger]="menu"
      [attr.aria-label]="'Open menu for user ' + row().username"
    >
      <ng-icon name="lucideEllipsis" aria-hidden="true" class="h-4 w-4" />
      <span class="sr-only">Open menu</span>
    </button>

    <ng-template #menu>
      <div hlmDropdownMenu class="w-40" align="end">
        <button type="button" hlmDropdownMenuItem (triggered)="onEdit()">
          Edit
          <span hlmDropdownMenuShortcut>
            <ng-icon name="lucideUserPen" aria-hidden="true" class="size-4" />
          </span>
        </button>
        <hr hlmDropdownMenuSeparator />
        <button
          type="button"
          hlmDropdownMenuItem
          class="text-red-500!"
          (triggered)="onDelete()"
        >
          Delete
          <span hlmDropdownMenuShortcut>
            <ng-icon name="lucideTrash2" aria-hidden="true" class="size-4" />
          </span>
        </button>
      </div>
    </ng-template>
  `,
})
export class UsersRowActionsComponent {
  readonly row = input.required<User>()

  private readonly store = inject(UsersStoreService)

  protected onEdit(): void {
    this.store.setCurrentRow(this.row())
    this.store.setOpen('edit')
  }

  protected onDelete(): void {
    this.store.setCurrentRow(this.row())
    this.store.setOpen('delete')
  }
}
