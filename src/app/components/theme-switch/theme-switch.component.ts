import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideCheck, lucideMoon, lucideSun } from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu'
import { ThemeService } from '../../core/services/theme.service'

/**
 * Theme switcher: ghost icon button (Sun/Moon crossfade, as in
 * `theme-switch.tsx`) opening a Light/Dark/System dropdown with a check on the
 * active theme. Also mirrors the source's `theme-color` meta-tag effect.
 */
@Component({
  selector: 'app-theme-switch',
  standalone: true,
  imports: [NgIcon, HlmButtonImports, HlmDropdownMenuImports],
  providers: [provideIcons({ lucideCheck, lucideMoon, lucideSun })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      hlmBtn
      variant="ghost"
      size="icon"
      type="button"
      class="scale-95 rounded-full"
      hlmDropdownMenuTrigger
      [hlmDropdownMenuTrigger]="menu"
      align="end"
    >
      <ng-icon
        name="lucideSun"
        aria-hidden="true"
        class="size-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
      />
      <ng-icon
        name="lucideMoon"
        aria-hidden="true"
        class="absolute size-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
      />
      <span class="sr-only">Toggle theme</span>
    </button>

    <ng-template #menu>
      <div hlmDropdownMenu align="end">
        <button type="button" hlmDropdownMenuItem (click)="setTheme('light')">
          Light
          @if (themeService.theme() === 'light') {
            <ng-icon
              name="lucideCheck"
              aria-hidden="true"
              class="ms-auto size-3.5"
            />
          }
        </button>
        <button type="button" hlmDropdownMenuItem (click)="setTheme('dark')">
          Dark
          @if (themeService.theme() === 'dark') {
            <ng-icon
              name="lucideCheck"
              aria-hidden="true"
              class="ms-auto size-3.5"
            />
          }
        </button>
        <button type="button" hlmDropdownMenuItem (click)="setTheme('system')">
          System
          @if (themeService.theme() === 'system') {
            <ng-icon
              name="lucideCheck"
              aria-hidden="true"
              class="ms-auto size-3.5"
            />
          }
        </button>
      </div>
    </ng-template>
  `,
})
export class ThemeSwitchComponent {
  protected readonly themeService = inject(ThemeService)

  constructor() {
    if (typeof document === 'undefined') return
    effect(() => {
      const theme = this.themeService.theme()
      const metaThemeColor = document.querySelector("meta[name='theme-color']")
      if (metaThemeColor) {
        metaThemeColor.setAttribute(
          'content',
          theme === 'dark' ? '#020817' : '#fff'
        )
      }
    })
  }

  protected setTheme(theme: 'light' | 'dark' | 'system'): void {
    this.themeService.setTheme(theme)
  }
}
