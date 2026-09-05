import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Injector,
  input,
  output,
  runInInjectionContext,
  signal,
} from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideCheck, lucideX } from '@ng-icons/lucide'
import { BrnCommandEmpty } from '@spartan-ng/brain/command'
import type { BrnDialogState } from '@spartan-ng/brain/dialog'
import { HlmBadgeImports } from '@spartan-ng/helm/badge'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmCommandImports } from '@spartan-ng/helm/command'
import { HlmDialogImports } from '@spartan-ng/helm/dialog'
import { showSubmittedData } from '../../../shared/utils/show-submitted-data'
import type { ChatUserPreview } from '../data/chat-types'

/**
 * New-chat dialog ported from
 * `shadcn-admin/src/features/chats/components/new-chat.tsx`: a
 * `sm:max-w-150` dialog titled "New message" with a "To:" row of selected
 * badges (X removes, Enter-to-remove), a command list of people
 * ("Search people...", "No people found.", avatar + name + username, check
 * when selected) and a Chat button (disabled when empty) that toasts the
 * selection. Selection resets when the dialog closes.
 */
@Component({
  selector: 'app-new-chat',
  standalone: true,
  imports: [
    NgIcon,
    BrnCommandEmpty,
    HlmBadgeImports,
    HlmButtonImports,
    HlmCommandImports,
    HlmDialogImports,
  ],
  providers: [provideIcons({ lucideCheck, lucideX })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <hlm-dialog
      [state]="open() ? 'open' : 'closed'"
      (stateChanged)="onStateChanged($event)"
    >
      <hlm-dialog-content *hlmDialogPortal class="sm:max-w-150">
        <div hlmDialogHeader>
          <h2 hlmDialogTitle>New message</h2>
        </div>
        <div class="flex flex-col gap-4">
          <div class="flex flex-wrap items-baseline-last gap-2">
            <span class="text-muted-foreground min-h-6 text-sm">To:</span>
            @for (user of selectedUsers(); track user.id) {
              <span hlmBadge>
                {{ user.fullName }}
                <button
                  type="button"
                  class="ring-offset-background focus:ring-ring ms-1 rounded-full outline-hidden focus:ring-2 focus:ring-offset-2"
                  [attr.aria-label]="'Remove ' + user.fullName"
                  (keydown.enter)="removeUser(user.id)"
                  (click)="removeUser(user.id)"
                >
                  <ng-icon
                    name="lucideX"
                    aria-hidden="true"
                    class="text-muted-foreground hover:text-foreground h-3 w-3"
                  />
                </button>
              </span>
            }
          </div>
          <hlm-command class="rounded-lg border">
            <hlm-command-input
              placeholder="Search people..."
              class="text-foreground"
            />
            <hlm-command-list>
              <div *brnCommandEmpty hlmCommandEmpty>No people found.</div>
              <div hlmCommandGroup>
                @for (user of users(); track user.id) {
                  <button
                    type="button"
                    hlmCommandItem
                    [value]="user.fullName + ' ' + user.username"
                    (selected)="toggleUser(user)"
                    class="hover:bg-accent hover:text-accent-foreground flex items-center justify-between gap-2"
                  >
                    <span class="flex items-center gap-2">
                      <img
                        [src]="user.profile || '/placeholder.svg'"
                        [alt]="user.fullName"
                        class="h-8 w-8 rounded-full"
                      />
                      <span class="flex flex-col">
                        <span class="text-sm font-medium">
                          {{ user.fullName }}
                        </span>
                        <span class="text-accent-foreground/70 text-xs">
                          {{ user.username }}
                        </span>
                      </span>
                    </span>
                    @if (isSelected(user.id)) {
                      <ng-icon
                        name="lucideCheck"
                        aria-hidden="true"
                        class="h-4 w-4"
                      />
                    }
                  </button>
                }
              </div>
            </hlm-command-list>
          </hlm-command>
          <button
            hlmBtn
            variant="default"
            type="button"
            [disabled]="selectedUsers().length === 0"
            (click)="onChat()"
          >
            Chat
          </button>
        </div>
      </hlm-dialog-content>
    </hlm-dialog>
  `,
})
export class NewChatComponent {
  readonly users = input<ChatUserPreview[]>([])
  readonly open = input(false)
  readonly closed = output<void>()

  protected readonly selectedUsers = signal<ChatUserPreview[]>([])

  private readonly injector = inject(Injector)

  constructor() {
    // Mirror the source dialog resetting its selection on close.
    effect(() => {
      if (!this.open()) this.selectedUsers.set([])
    })
  }

  protected toggleUser(user: ChatUserPreview): void {
    if (this.isSelected(user.id)) {
      this.removeUser(user.id)
    } else {
      this.selectedUsers.update((users) => [...users, user])
    }
  }

  protected removeUser(userId: string): void {
    this.selectedUsers.update((users) =>
      users.filter((user) => user.id !== userId)
    )
  }

  protected isSelected(userId: string): boolean {
    return this.selectedUsers().some((user) => user.id === userId)
  }

  protected onStateChanged(state: BrnDialogState): void {
    if (state === 'closed') {
      this.selectedUsers.set([])
      this.closed.emit()
    }
  }

  protected onChat(): void {
    // showSubmittedData() injects ToastService, so it must run inside an
    // injection context (click handlers are not one).
    runInInjectionContext(this.injector, () =>
      showSubmittedData(this.selectedUsers())
    )
  }
}
