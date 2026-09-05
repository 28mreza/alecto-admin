import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideSearch } from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { SearchService } from '../../core/services/search.service'

/**
 * Search trigger button.
 *
 * Copies the classes from `search.tsx`: outline button with a Search icon,
 * placeholder text and a kbd hint (`⌘K` on macOS, `Ctrl K` elsewhere).
 * Clicking (or Ctrl/Cmd+K anywhere) opens the command palette.
 */
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [NgIcon, HlmButtonImports],
  providers: [provideIcons({ lucideSearch })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // className goes on the HOST (the flex item in the header row), so layout
  // classes like `me-auto` push sibling controls to the far end — mirroring
  // the source where className lands on the button that is itself the flex item.
  host: {
    '[class]': 'className()',
  },
  template: `
    <button
      hlmBtn
      variant="outline"
      type="button"
      aria-keyshortcuts="Meta+K Control+K"
      [class]="'group bg-muted/25 text-muted-foreground hover:bg-accent relative h-8 w-full flex-1 justify-start rounded-md text-sm font-normal shadow-none sm:w-40 sm:pe-12 md:flex-none lg:w-52 xl:w-64'"
      (click)="searchService.setOpen(true)"
    >
      <ng-icon
        name="lucideSearch"
        aria-hidden="true"
        class="absolute start-1.5 top-1/2 size-4 -translate-y-1/2"
      />
      <span class="ms-4">{{ placeholder() }}</span>
      <kbd
        class="bg-muted group-hover:bg-accent pointer-events-none absolute end-[0.3rem] top-[0.3rem] hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex"
      >
        @if (isMac()) {
          <span class="text-xs">⌘</span><span>K</span>
        } @else {
          <span>Ctrl K</span>
        }
      </kbd>
    </button>
  `,
})
export class SearchComponent {
  readonly className = input('')
  readonly placeholder = input('Search')

  protected readonly searchService = inject(SearchService)

  protected readonly isMac = signal(
    typeof navigator !== 'undefined' &&
      /mac|iphone|ipad|darwin/i.test(
        navigator.userAgent ?? navigator.platform ?? ''
      )
  )
}
