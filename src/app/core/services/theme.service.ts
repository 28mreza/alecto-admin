import { Injectable, computed, effect, inject, signal } from '@angular/core'
import { StorageService } from './storage.service'

export type Theme = 'light' | 'dark' | 'system'

const DEFAULT_THEME: Theme = 'light'
const THEME_KEY = 'theme'

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly defaultTheme = DEFAULT_THEME
  readonly theme = signal<Theme>(DEFAULT_THEME)

  readonly resolvedTheme = computed<'light' | 'dark'>((): 'light' | 'dark' => {
    const theme = this.theme()
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    }
    return theme
  })

  private readonly mediaQuery = window.matchMedia(
    '(prefers-color-scheme: dark)'
  )

  private readonly storage = inject(StorageService)

  constructor() {
    const saved = this.storage.get<Theme>(THEME_KEY)
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      this.theme.set(saved)
    }

    effect(() => {
      this.applyTheme(this.resolvedTheme())
    })

    this.mediaQuery.addEventListener('change', () => {
      if (this.theme() === 'system') {
        this.applyTheme(this.mediaQuery.matches ? 'dark' : 'light')
      }
    })
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme)
    this.applyTheme(this.resolvedTheme())
    this.storage.set(THEME_KEY, theme)
  }

  resetTheme(): void {
    this.theme.set(DEFAULT_THEME)
    this.applyTheme(this.resolvedTheme())
    this.storage.remove(THEME_KEY)
  }

  private applyTheme(resolved: 'light' | 'dark'): void {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(resolved)
  }
}
