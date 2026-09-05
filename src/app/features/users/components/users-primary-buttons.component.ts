import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideMailPlus, lucideUserPlus } from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { UsersStoreService } from '../store/users-store.service'

/**
 * Heading-row actions for the users page.
 *
 * Ported from `users-primary-buttons.tsx`: an outline Invite User button
 * and an Add User button opening the matching dialogs via the store.
 */
@Component({
  selector: 'app-users-primary-buttons',
  standalone: true,
  imports: [NgIcon, HlmButtonImports],
  providers: [provideIcons({ lucideMailPlus, lucideUserPlus })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex gap-2">
      <button
        hlmBtn
        variant="outline"
        type="button"
        class="space-x-1"
        (click)="store.setOpen('invite')"
      >
        <span>Invite User</span>
        <ng-icon name="lucideMailPlus" aria-hidden="true" class="size-[18px]" />
      </button>
      <button
        hlmBtn
        type="button"
        class="space-x-1"
        (click)="store.setOpen('add')"
      >
        <span>Add User</span>
        <ng-icon name="lucideUserPlus" aria-hidden="true" class="size-[18px]" />
      </button>
    </div>
  `,
})
export class UsersPrimaryButtonsComponent {
  protected readonly store = inject(UsersStoreService)
}
