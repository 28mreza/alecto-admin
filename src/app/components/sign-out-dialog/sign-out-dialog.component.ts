import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core'
import { Router } from '@angular/router'
import type { BrnDialogState } from '@spartan-ng/brain/dialog'
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog'
import { HlmButtonImports } from '@spartan-ng/helm/button'

/**
 * Sign-out confirmation ported from
 * `shadcn-admin/src/components/sign-out-dialog.tsx`: destructive
 * `sm:max-w-sm` alert dialog ("Sign out" / "Are you sure you want to sign
 * out? ..."). Confirming navigates to `/sign-in` with the current location
 * preserved in the `redirect` query param (replaceUrl), mirroring the
 * source. Resolves the tracked Task 12 follow-up: `ProfileDropdownComponent`
 * opens this dialog instead of navigating directly.
 */
@Component({
  selector: 'app-sign-out-dialog',
  standalone: true,
  imports: [HlmAlertDialogImports, HlmButtonImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <hlm-alert-dialog
      [state]="open() ? 'open' : 'closed'"
      (stateChanged)="onStateChanged($event)"
    >
      <hlm-alert-dialog-content *hlmAlertDialogPortal class="sm:max-w-sm">
        <div hlmAlertDialogHeader>
          <h2 hlmAlertDialogTitle>Sign out</h2>
          <p hlmAlertDialogDescription>
            Are you sure you want to sign out? You will need to sign in again to
            access your account.
          </p>
        </div>
        <div hlmAlertDialogFooter>
          <button hlmAlertDialogCancel type="button">Cancel</button>
          <button
            hlmAlertDialogAction
            variant="destructive"
            type="button"
            (click)="onConfirm()"
          >
            Sign out
          </button>
        </div>
      </hlm-alert-dialog-content>
    </hlm-alert-dialog>
  `,
})
export class SignOutDialogComponent {
  readonly open = input(false)
  readonly closed = output<void>()

  private readonly router = inject(Router)

  protected onStateChanged(state: BrnDialogState): void {
    if (state === 'closed') {
      this.closed.emit()
    }
  }

  protected onConfirm(): void {
    const currentPath = this.router.url
    this.closed.emit()
    void this.router.navigate(['/sign-in'], {
      queryParams: { redirect: currentPath },
      replaceUrl: true,
    })
  }
}
