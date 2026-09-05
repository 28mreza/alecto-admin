import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideRefreshCw } from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip'

/**
 * Hard-refresh button for the app header: an icon button showing the
 * platform-appropriate hard-refresh shortcut (Ctrl+Shift+R on
 * Windows/Linux, Cmd+Shift+R on macOS). Clicking reloads the page.
 * The keyboard shortcut itself is intentionally NOT intercepted so the
 * browser keeps performing a true (cache-bypassing) hard refresh.
 */
@Component({
  selector: 'app-refresh-button',
  standalone: true,
  imports: [NgIcon, HlmButtonImports, HlmTooltipImports],
  providers: [provideIcons({ lucideRefreshCw })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      hlmBtn
      variant="ghost"
      size="icon"
      type="button"
      class="size-8 rounded-full"
      aria-label="Reload page"
      [hlmTooltip]="refreshTip"
      (click)="reload()"
    >
      <ng-icon name="lucideRefreshCw" aria-hidden="true" class="size-4" />
      <span class="sr-only">{{ hint() }}</span>
    </button>
    <ng-template #refreshTip>{{ hint() }}</ng-template>
  `,
})
export class RefreshButtonComponent {
  protected readonly isMac = signal(
    typeof navigator !== 'undefined' &&
      /mac|iphone|ipad|darwin/i.test(
        navigator.userAgent ?? navigator.platform ?? ''
      )
  )

  protected readonly hint = computed(() =>
    this.isMac() ? 'Hard refresh (⌘+Shift+R)' : 'Hard refresh (Ctrl+Shift+R)'
  )

  protected reload(): void {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }
}
