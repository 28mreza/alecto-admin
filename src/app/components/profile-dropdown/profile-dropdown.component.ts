import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { HlmAvatarImports } from '@spartan-ng/helm/avatar'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu'
import { SignOutDialogComponent } from '../sign-out-dialog/sign-out-dialog.component'
import { sidebarData } from '../layout/data/sidebar-data'

/**
 * Profile dropdown: avatar trigger with the user's name/email label and the
 * exact menu items from `profile-dropdown.tsx` (Profile, Billing, Settings,
 * New Team, Sign out with their shortcuts).
 *
 * Sign out opens the `SignOutDialogComponent` confirmation (ported from
 * `sign-out-dialog.tsx`) instead of navigating directly — the dialog
 * navigates to `/sign-in` with the `redirect` query param on confirm.
 */
@Component({
  selector: 'app-profile-dropdown',
  standalone: true,
  imports: [
    RouterLink,
    HlmAvatarImports,
    HlmButtonImports,
    HlmDropdownMenuImports,
    SignOutDialogComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      hlmBtn
      variant="ghost"
      type="button"
      class="relative h-8 w-8 rounded-full"
      hlmDropdownMenuTrigger
      [hlmDropdownMenuTrigger]="menu"
      align="end"
    >
      <hlm-avatar class="h-8 w-8">
        <img hlmAvatarImage [src]="user.avatar" [alt]="user.name" />
        <span hlmAvatarFallback>SN</span>
      </hlm-avatar>
    </button>

    <ng-template #menu>
      <div hlmDropdownMenu class="w-56" align="end">
        <div hlmDropdownMenuLabel class="font-normal">
          <div class="flex flex-col gap-1.5">
            <p class="text-sm leading-none font-medium">{{ user.name }}</p>
            <p class="text-muted-foreground text-xs leading-none">
              {{ user.email }}
            </p>
          </div>
        </div>
        <hr hlmDropdownMenuSeparator />
        <div hlmDropdownMenuGroup>
          <a hlmDropdownMenuItem routerLink="/settings">
            Profile
            <span hlmDropdownMenuShortcut>⇧⌘P</span>
          </a>
          <a hlmDropdownMenuItem routerLink="/settings">
            Billing
            <span hlmDropdownMenuShortcut>⌘B</span>
          </a>
          <a hlmDropdownMenuItem routerLink="/settings">
            Settings
            <span hlmDropdownMenuShortcut>⌘S</span>
          </a>
          <button type="button" hlmDropdownMenuItem>New Team</button>
        </div>
        <hr hlmDropdownMenuSeparator />
        <button
          type="button"
          hlmDropdownMenuItem
          variant="destructive"
          (click)="signOutOpen.set(true)"
        >
          Sign out
          <span hlmDropdownMenuShortcut class="text-current">⇧⌘Q</span>
        </button>
      </div>
    </ng-template>

    <app-sign-out-dialog
      [open]="signOutOpen()"
      (closed)="signOutOpen.set(false)"
    />
  `,
})
export class ProfileDropdownComponent {
  protected readonly user = sidebarData.user
  protected readonly signOutOpen = signal(false)
}
