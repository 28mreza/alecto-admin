import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core'
import { format } from 'date-fns'
import { NgIcon, provideIcons } from '@ng-icons/core'
import {
  lucideArrowLeft,
  lucideEdit,
  lucideImagePlus,
  lucideMessagesSquare,
  lucideMoreVertical,
  lucidePaperclip,
  lucidePhone,
  lucidePlus,
  lucideSearch,
  lucideSend,
  lucideVideo,
} from '@ng-icons/lucide'
import { HlmAvatarImports } from '@spartan-ng/helm/avatar'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area'
import { HlmSeparatorImports } from '@spartan-ng/helm/separator'
import { NgScrollbar } from 'ngx-scrollbar'
import { ConfigDrawerComponent } from '../../components/config-drawer/config-drawer.component'
import { HeaderComponent } from '../../components/layout/header/header.component'
import { MainComponent } from '../../components/layout/main/main.component'
import { ProfileDropdownComponent } from '../../components/profile-dropdown/profile-dropdown.component'
import { RefreshButtonComponent } from '../../components/refresh-button/refresh-button.component'
import { SearchComponent } from '../../components/search/search.component'
import { ThemeSwitchComponent } from '../../components/theme-switch/theme-switch.component'
import { getDisplayNameInitials } from '../../shared/utils/display-name'
import { NewChatComponent } from './components/new-chat.component'
import type { ChatUser, ChatUserPreview, Convo } from './data/chat-types'
// Fake data (mirrors `import { conversations } from './data/convo.json'`).
import convoData from './data/convo.json'

const conversations = (convoData as unknown as { conversations: ChatUser[] })
  .conversations

/**
 * Filters the chat list by full name (case-insensitive, trimmed), mirroring
 * the source `filteredChatList`. Exported for focused unit tests.
 */
export function filterChatList(users: ChatUser[], search: string): ChatUser[] {
  const query = search.trim().toLowerCase()
  return users.filter(({ fullName }) => fullName.toLowerCase().includes(query))
}

/**
 * Groups a user's messages by formatted date (`d MMM, yyyy`), preserving the
 * source reduce order (newest-first, as stored in `convo.json`). Exported for
 * focused unit tests.
 */
export function groupMessagesByDate(
  messages: Convo[]
): Record<string, Convo[]> {
  return messages.reduce<Record<string, Convo[]>>((acc, msg) => {
    const key = format(msg.timestamp, 'd MMM, yyyy')
    if (!acc[key]) acc[key] = []
    acc[key].push(msg)
    return acc
  }, {})
}

/**
 * Chats page (`/chats`).
 *
 * Ported from `shadcn-admin/src/features/chats/index.tsx`: fixed header
 * (search + theme switch + config drawer + profile), a two-panel section —
 * left inbox list (sticky "Inbox" heading + new-chat button, search box,
 * scrollable chat list with avatar + last-message preview) and right
 * conversation panel (user header, date-grouped bubbles, static input form)
 * or a "Your messages" empty state. On mobile the right panel slides over
 * (`inset-s-0 flex`) with a back button. The input form is static (no send
 * logic), faithful to the source.
 */
@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [
    NgIcon,
    NgScrollbar,
    HeaderComponent,
    MainComponent,
    SearchComponent,
    RefreshButtonComponent,
    ThemeSwitchComponent,
    ConfigDrawerComponent,
    ProfileDropdownComponent,
    NewChatComponent,
    HlmAvatarImports,
    HlmButtonImports,
    HlmScrollAreaImports,
    HlmSeparatorImports,
  ],
  providers: [
    provideIcons({
      lucideArrowLeft,
      lucideEdit,
      lucideImagePlus,
      lucideMessagesSquare,
      lucideMoreVertical,
      lucidePaperclip,
      lucidePhone,
      lucidePlus,
      lucideSearch,
      lucideSend,
      lucideVideo,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-header [fixed]="true">
      <app-search className="me-auto" />
      <app-refresh-button />
      <app-theme-switch />
      <app-config-drawer />
      <app-profile-dropdown />
    </app-header>

    <app-main [fixed]="true">
      <section class="flex h-full gap-6">
        <!-- Left Side -->
        <div class="flex w-full flex-col gap-2 sm:w-56 lg:w-72 2xl:w-80">
          <div
            class="bg-background sticky top-0 z-10 -mx-4 px-4 pb-3 shadow-md sm:static sm:z-auto sm:mx-0 sm:p-0 sm:shadow-none"
          >
            <div class="flex items-center justify-between py-2">
              <div class="flex gap-2">
                <h1 class="text-2xl font-bold">Inbox</h1>
                <ng-icon
                  name="lucideMessagesSquare"
                  size="20"
                  aria-hidden="true"
                />
              </div>

              <button
                hlmBtn
                size="icon"
                variant="ghost"
                type="button"
                aria-label="New chat"
                class="rounded-lg"
                (click)="newChatOpen.set(true)"
              >
                <ng-icon
                  name="lucideEdit"
                  size="24"
                  aria-hidden="true"
                  class="stroke-muted-foreground"
                />
              </button>
            </div>

            <label
              class="border-border focus-within:ring-ring flex h-10 w-full items-center space-x-0 rounded-md border ps-2 focus-within:ring-1 focus-within:outline-hidden"
            >
              <ng-icon
                name="lucideSearch"
                size="15"
                aria-hidden="true"
                class="me-2 stroke-slate-500"
              />
              <span class="sr-only">Search</span>
              <input
                type="text"
                class="w-full flex-1 bg-inherit text-sm focus-visible:outline-hidden"
                placeholder="Search chat..."
                [value]="search()"
                (input)="onSearch($event)"
              />
            </label>
          </div>

          <ng-scrollbar hlm class="-mx-3 h-full p-3">
            @for (chatUser of filteredChatList(); track chatUser.id) {
              <button
                type="button"
                (click)="selectUser(chatUser)"
                [class]="
                  'group hover:bg-accent hover:text-accent-foreground flex w-full rounded-md px-2 py-2 text-start text-sm' +
                  (selectedUser()?.id === chatUser.id ? ' sm:bg-muted' : '')
                "
              >
                <div class="flex gap-2">
                  <hlm-avatar>
                    <img
                      hlmAvatarImage
                      [src]="chatUser.profile"
                      [alt]="chatUser.username"
                    />
                    <span hlmAvatarFallback>
                      {{ initials(chatUser.fullName) }}
                    </span>
                  </hlm-avatar>
                  <div>
                    <span class="col-start-2 row-span-2 font-medium">
                      {{ chatUser.fullName }}
                    </span>
                    <span
                      class="text-muted-foreground group-hover:text-accent-foreground/90 col-start-2 row-span-2 row-start-2 line-clamp-2 text-ellipsis"
                    >
                      {{ lastMessagePreview(chatUser) }}
                    </span>
                  </div>
                </div>
              </button>
              <div hlmSeparator class="my-1"></div>
            }
          </ng-scrollbar>
        </div>

        <!-- Right Side -->
        @if (selectedUser(); as user) {
          <div
            [class]="
              'bg-background absolute inset-0 start-full z-50 hidden w-full flex-1 flex-col border shadow-xs sm:static sm:z-auto sm:flex sm:rounded-md' +
              (mobileSelectedUser() ? ' inset-s-0 flex' : '')
            "
          >
            <!-- Top Part -->
            <div
              class="bg-card mb-1 flex flex-none justify-between p-4 shadow-lg sm:rounded-t-md"
            >
              <!-- Left -->
              <div class="flex gap-3">
                <button
                  hlmBtn
                  size="icon"
                  variant="ghost"
                  type="button"
                  aria-label="Back to inbox"
                  class="-ms-2 h-full sm:hidden"
                  (click)="clearMobileSelection()"
                >
                  <ng-icon
                    name="lucideArrowLeft"
                    aria-hidden="true"
                    class="rtl:rotate-180"
                  />
                </button>
                <div class="flex items-center gap-2 lg:gap-4">
                  <hlm-avatar class="size-9 lg:size-11">
                    <img
                      hlmAvatarImage
                      [src]="user.profile"
                      [alt]="user.username"
                    />
                    <span hlmAvatarFallback>
                      {{ initials(user.fullName) }}
                    </span>
                  </hlm-avatar>
                  <div>
                    <span
                      class="col-start-2 row-span-2 text-sm font-medium lg:text-base"
                    >
                      {{ user.fullName }}
                    </span>
                    <span
                      class="text-muted-foreground col-start-2 row-span-2 row-start-2 line-clamp-1 block max-w-32 text-xs text-nowrap text-ellipsis lg:max-w-none lg:text-sm"
                    >
                      {{ user.title }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Right -->
              <div class="-me-1 flex items-center gap-1 lg:gap-2">
                <button
                  hlmBtn
                  size="icon"
                  variant="ghost"
                  type="button"
                  aria-label="Start video call"
                  class="hidden size-8 rounded-full sm:inline-flex lg:size-10"
                >
                  <ng-icon
                    name="lucideVideo"
                    size="22"
                    aria-hidden="true"
                    class="stroke-muted-foreground"
                  />
                </button>
                <button
                  hlmBtn
                  size="icon"
                  variant="ghost"
                  type="button"
                  aria-label="Start voice call"
                  class="hidden size-8 rounded-full sm:inline-flex lg:size-10"
                >
                  <ng-icon
                    name="lucidePhone"
                    size="22"
                    aria-hidden="true"
                    class="stroke-muted-foreground"
                  />
                </button>
                <button
                  hlmBtn
                  size="icon"
                  variant="ghost"
                  type="button"
                  aria-label="More options"
                  class="h-10 rounded-md sm:h-8 sm:w-4 lg:h-10 lg:w-6"
                >
                  <ng-icon
                    name="lucideMoreVertical"
                    aria-hidden="true"
                    class="stroke-muted-foreground sm:size-5"
                  />
                </button>
              </div>
            </div>

            <!-- Conversation -->
            <div class="flex flex-1 flex-col gap-2 rounded-md px-4 pt-0 pb-4">
              <div class="flex size-full flex-1">
                <div
                  class="relative -me-4 flex flex-1 flex-col overflow-y-hidden"
                >
                  <div
                    class="flex h-40 w-full grow flex-col-reverse justify-start gap-4 overflow-y-auto py-2 pe-4 pb-4"
                  >
                    @for (group of messageGroups(); track group[0]) {
                      @for (
                        msg of group[1];
                        track msg.timestamp + '-' + msg.sender + '-' + $index
                      ) {
                        <div
                          [class]="
                            'max-w-72 px-3 py-2 wrap-break-word shadow-lg' +
                            (msg.sender === 'You'
                              ? ' bg-primary/90 text-primary-foreground/75 self-end rounded-[16px_16px_0_16px]'
                              : ' bg-muted self-start rounded-[16px_16px_16px_0]')
                          "
                        >
                          {{ msg.message }}
                          <span
                            [class]="
                              'text-foreground/75 mt-1 block text-xs font-light italic' +
                              (msg.sender === 'You'
                                ? ' text-primary-foreground/85 text-end'
                                : '')
                            "
                          >
                            {{ formatTime(msg.timestamp) }}
                          </span>
                        </div>
                      }
                      <div class="text-center text-xs">{{ group[0] }}</div>
                    }
                  </div>
                </div>
              </div>
              <form class="flex w-full flex-none gap-2">
                <div
                  class="border-input bg-card focus-within:ring-ring flex flex-1 items-center gap-2 rounded-md border px-2 py-1 focus-within:ring-1 focus-within:outline-hidden lg:gap-4"
                >
                  <div class="space-x-1">
                    <button
                      hlmBtn
                      size="icon"
                      type="button"
                      variant="ghost"
                      aria-label="Add"
                      class="h-8 rounded-md"
                    >
                      <ng-icon
                        name="lucidePlus"
                        size="20"
                        aria-hidden="true"
                        class="stroke-muted-foreground"
                      />
                    </button>
                    <button
                      hlmBtn
                      size="icon"
                      type="button"
                      variant="ghost"
                      aria-label="Add image"
                      class="hidden h-8 rounded-md lg:inline-flex"
                    >
                      <ng-icon
                        name="lucideImagePlus"
                        size="20"
                        aria-hidden="true"
                        class="stroke-muted-foreground"
                      />
                    </button>
                    <button
                      hlmBtn
                      size="icon"
                      type="button"
                      variant="ghost"
                      aria-label="Attach file"
                      class="hidden h-8 rounded-md lg:inline-flex"
                    >
                      <ng-icon
                        name="lucidePaperclip"
                        size="20"
                        aria-hidden="true"
                        class="stroke-muted-foreground"
                      />
                    </button>
                  </div>
                  <label class="flex-1">
                    <span class="sr-only">Chat Text Box</span>
                    <input
                      type="text"
                      placeholder="Type your messages..."
                      class="h-8 w-full bg-inherit focus-visible:outline-hidden"
                    />
                  </label>
                  <button
                    hlmBtn
                    variant="ghost"
                    size="icon"
                    type="button"
                    aria-label="Send message"
                    class="hidden sm:inline-flex"
                  >
                    <ng-icon name="lucideSend" size="20" aria-hidden="true" />
                  </button>
                </div>
                <button hlmBtn type="button" class="h-full sm:hidden">
                  <ng-icon name="lucideSend" size="18" aria-hidden="true" />
                  Send
                </button>
              </form>
            </div>
          </div>
        } @else {
          <div
            class="bg-card absolute inset-0 start-full z-50 hidden w-full flex-1 flex-col justify-center rounded-md border shadow-xs sm:static sm:z-auto sm:flex"
          >
            <div class="flex flex-col items-center space-y-6">
              <div
                class="border-border flex size-16 items-center justify-center rounded-full border-2"
              >
                <ng-icon
                  name="lucideMessagesSquare"
                  aria-hidden="true"
                  class="size-8"
                />
              </div>
              <div class="space-y-2 text-center">
                <h1 class="text-xl font-semibold">Your messages</h1>
                <p class="text-muted-foreground text-sm">
                  Send a message to start a chat.
                </p>
              </div>
              <button hlmBtn type="button" (click)="newChatOpen.set(true)">
                Send message
              </button>
            </div>
          </div>
        }
      </section>
      <app-new-chat
        [users]="users"
        [open]="newChatOpen()"
        (closed)="newChatOpen.set(false)"
      />
    </app-main>
  `,
})
export class ChatsComponent {
  protected readonly search = signal('')
  protected readonly selectedUser = signal<ChatUser | null>(null)
  protected readonly mobileSelectedUser = signal<ChatUser | null>(null)
  protected readonly newChatOpen = signal(false)

  protected readonly conversations: ChatUser[] = conversations

  protected readonly filteredChatList = computed(() =>
    filterChatList(this.conversations, this.search())
  )

  protected readonly currentMessage = computed(() => {
    const user = this.selectedUser()
    return user ? groupMessagesByDate(user.messages) : null
  })

  protected readonly messageGroups = computed(() =>
    Object.entries(this.currentMessage() ?? {})
  )

  protected readonly users: ChatUserPreview[] = conversations.map((user) => ({
    id: user.id,
    profile: user.profile,
    username: user.username,
    fullName: user.fullName,
    title: user.title,
  }))

  protected onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value)
  }

  protected selectUser(user: ChatUser): void {
    this.selectedUser.set(user)
    this.mobileSelectedUser.set(user)
  }

  protected clearMobileSelection(): void {
    this.mobileSelectedUser.set(null)
  }

  protected lastMessagePreview(user: ChatUser): string {
    const last = user.messages[0]
    return last.sender === 'You' ? `You: ${last.message}` : last.message
  }

  protected initials(fullName: string): string {
    return getDisplayNameInitials(fullName)
  }

  protected formatTime(timestamp: string): string {
    return format(timestamp, 'h:mm a')
  }
}
