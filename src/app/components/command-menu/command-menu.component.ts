import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { Router } from '@angular/router'
import { NgIcon, provideIcons } from '@ng-icons/core'
import {
  lucideArrowRight,
  lucideChevronRight,
  lucideLaptop,
  lucideMoon,
  lucideSun,
} from '@ng-icons/lucide'
import { type BrnDialogState } from '@spartan-ng/brain/dialog'
import { BrnCommandEmpty } from '@spartan-ng/brain/command'
import { HlmCommandImports } from '@spartan-ng/helm/command'
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area'
import { NgScrollbar } from 'ngx-scrollbar'
import { SearchService } from '../../core/services/search.service'
import { ThemeService, type Theme } from '../../core/services/theme.service'
import { sidebarData } from '../layout/data/sidebar-data'

interface CommandNavEntry {
  title: string
  parentTitle: string | null
  /** Text the brain command filter matches against. */
  value: string
  url: string
}

interface CommandNavGroup {
  title: string
  entries: CommandNavEntry[]
}

/**
 * Global command palette (Ctrl/Cmd+K).
 *
 * Faithful port of `command-menu.tsx`: navigation groups come from
 * `sidebarData.navGroups` (direct links plus `parent › child` sub-items) and a
 * trailing Theme group delegates to `ThemeService`. Filtering, arrow-key
 * navigation and Enter-to-select are provided by the Spartan brain command
 * (default filter: case-insensitive `value.includes(search)`), so no custom
 * filter code is needed — each item's `value` carries its matchable text.
 */
@Component({
  selector: 'app-command-menu',
  standalone: true,
  imports: [
    NgIcon,
    BrnCommandEmpty,
    HlmCommandImports,
    HlmScrollAreaImports,
    NgScrollbar,
  ],
  providers: [
    provideIcons({
      lucideArrowRight,
      lucideChevronRight,
      lucideLaptop,
      lucideMoon,
      lucideSun,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <hlm-command-dialog
      [state]="searchService.open() ? 'open' : 'closed'"
      (stateChange)="onStateChange($event)"
      dialogContentClass="sm:max-w-lg"
    >
      <hlm-command>
        <hlm-command-input placeholder="Type a command or search..." />
        <hlm-command-list>
          <ng-scrollbar hlm class="h-72 pe-1">
            <div *brnCommandEmpty hlmCommandEmpty>No results found.</div>
            @for (group of navGroups; track group.title) {
              <div hlmCommandGroup>
                <div hlmCommandGroupLabel>{{ group.title }}</div>
                @for (entry of group.entries; track entry.url) {
                  <button
                    type="button"
                    hlmCommandItem
                    [value]="entry.value"
                    (selected)="runCommand(entry.url)"
                  >
                    <span class="flex size-4 items-center justify-center">
                      <ng-icon
                        name="lucideArrowRight"
                        class="text-muted-foreground/80 size-2"
                      />
                    </span>
                    @if (entry.parentTitle) {
                      <span>{{ entry.parentTitle }}</span>
                      <ng-icon
                        name="lucideChevronRight"
                        class="size-4 shrink-0"
                      />
                      <span>{{ entry.title }}</span>
                    } @else {
                      <span>{{ entry.title }}</span>
                    }
                  </button>
                }
              </div>
            }
            <hr hlmCommandSeparator />
            <div hlmCommandGroup>
              <div hlmCommandGroupLabel>Theme</div>
              <button
                type="button"
                hlmCommandItem
                value="Light"
                (selected)="runThemeCommand('light')"
              >
                <ng-icon name="lucideSun" />
                <span>Light</span>
              </button>
              <button
                type="button"
                hlmCommandItem
                value="Dark"
                (selected)="runThemeCommand('dark')"
              >
                <ng-icon name="lucideMoon" class="scale-90" />
                <span>Dark</span>
              </button>
              <button
                type="button"
                hlmCommandItem
                value="System"
                (selected)="runThemeCommand('system')"
              >
                <ng-icon name="lucideLaptop" />
                <span>System</span>
              </button>
            </div>
          </ng-scrollbar>
        </hlm-command-list>
      </hlm-command>
    </hlm-command-dialog>
  `,
})
export class CommandMenuComponent {
  protected readonly searchService = inject(SearchService)
  private readonly themeService = inject(ThemeService)
  private readonly router = inject(Router)

  protected readonly navGroups: CommandNavGroup[] = sidebarData.navGroups.map(
    (group) => ({
      title: group.title,
      entries: group.items.flatMap((item): CommandNavEntry[] =>
        item.url
          ? [
              {
                title: item.title,
                parentTitle: null,
                value: item.title,
                url: item.url,
              },
            ]
          : (item.items ?? []).map((subItem) => ({
              title: subItem.title,
              parentTitle: item.title,
              value: `${item.title} ${subItem.title}`,
              url: subItem.url,
            }))
      ),
    })
  )

  protected onStateChange(state: BrnDialogState): void {
    if (state === 'closed') {
      this.searchService.setOpen(false)
    }
  }

  protected runCommand(url: string): void {
    this.searchService.setOpen(false)
    void this.router.navigate([url])
  }

  protected runThemeCommand(theme: Theme): void {
    this.searchService.setOpen(false)
    this.themeService.setTheme(theme)
  }
}
