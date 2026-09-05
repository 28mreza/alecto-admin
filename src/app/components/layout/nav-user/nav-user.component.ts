import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core'
import { RouterLink } from '@angular/router'
import { NgIcon, provideIcons } from '@ng-icons/core'
import {
  lucideBadgeCheck,
  lucideBell,
  lucideChevronsUpDown,
  lucideCreditCard,
  lucideLogOut,
  lucideSparkles,
} from '@ng-icons/lucide'
import { HlmAvatarImports } from '@spartan-ng/helm/avatar'
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu'
import { getDisplayNameInitials } from '../../../shared/utils/display-name'
import { SidebarService } from '../../../core/services/sidebar.service'
import { type User } from '../types'

@Component({
  selector: 'app-nav-user',
  standalone: true,
  imports: [RouterLink, NgIcon, HlmAvatarImports, HlmDropdownMenuImports],
  providers: [
    provideIcons({
      lucideBadgeCheck,
      lucideBell,
      lucideChevronsUpDown,
      lucideCreditCard,
      lucideLogOut,
      lucideSparkles,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul class="flex w-full min-w-0 flex-col gap-1" data-slot="sidebar-menu">
      <li class="group/menu-item relative" data-slot="sidebar-menu-item">
        <button
          type="button"
          hlmDropdownMenuTrigger
          [hlmDropdownMenuTrigger]="menu"
          [side]="isMobile() ? 'bottom' : 'right'"
          align="end"
          [attr.data-state]="menuOpen() ? 'open' : 'closed'"
          class="peer/menu-button ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex h-12 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-start text-sm outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pe-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0! focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:font-medium"
          (hlmDropdownMenuOpened)="menuOpen.set(true)"
          (hlmDropdownMenuClosed)="menuOpen.set(false)"
        >
          <hlm-avatar class="h-8 w-8 rounded-lg">
            <img hlmAvatarImage [src]="user().avatar" [alt]="user().name" />
            <span hlmAvatarFallback class="rounded-lg">{{ initials() }}</span>
          </hlm-avatar>
          <div class="grid flex-1 text-start text-sm leading-tight">
            <span class="truncate font-semibold">{{ user().name }}</span>
            <span class="truncate text-xs">{{ user().email }}</span>
          </div>
          <ng-icon
            name="lucideChevronsUpDown"
            class="ms-auto size-4 shrink-0"
          />
        </button>

        <ng-template #menu>
          <div hlmDropdownMenu [sideOffset]="4" class="w-56 rounded-lg">
            <div hlmDropdownMenuLabel class="p-0 font-normal">
              <div
                class="flex items-center gap-2 px-1 py-1.5 text-start text-sm"
              >
                <hlm-avatar class="h-8 w-8 rounded-lg">
                  <img
                    hlmAvatarImage
                    [src]="user().avatar"
                    [alt]="user().name"
                  />
                  <span hlmAvatarFallback class="rounded-lg">{{
                    initials()
                  }}</span>
                </hlm-avatar>
                <div class="grid flex-1 text-start text-sm leading-tight">
                  <span class="truncate font-semibold">{{ user().name }}</span>
                  <span class="truncate text-xs">{{ user().email }}</span>
                </div>
              </div>
            </div>
            <hr hlmDropdownMenuSeparator />
            <div hlmDropdownMenuGroup>
              <button type="button" hlmDropdownMenuItem>
                <ng-icon name="lucideSparkles" />
                Upgrade to Pro
              </button>
            </div>
            <hr hlmDropdownMenuSeparator />
            <div hlmDropdownMenuGroup>
              <a hlmDropdownMenuItem routerLink="/settings/account">
                <ng-icon name="lucideBadgeCheck" />
                Account
              </a>
              <a hlmDropdownMenuItem routerLink="/settings">
                <ng-icon name="lucideCreditCard" />
                Billing
              </a>
              <a hlmDropdownMenuItem routerLink="/settings/notifications">
                <ng-icon name="lucideBell" />
                Notifications
              </a>
            </div>
            <hr hlmDropdownMenuSeparator />
            <button type="button" hlmDropdownMenuItem variant="destructive">
              <ng-icon name="lucideLogOut" />
              Sign out
            </button>
          </div>
        </ng-template>
      </li>
    </ul>
  `,
})
export class NavUserComponent {
  readonly user = input.required<User>()

  readonly menuOpen = signal(false)

  private readonly sidebarService = inject(SidebarService)

  protected readonly isMobile = this.sidebarService.isMobile

  protected readonly initials = () => getDisplayNameInitials(this.user().name)
}
