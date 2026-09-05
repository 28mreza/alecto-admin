import { Component, effect, inject } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { NavigationProgressComponent } from './components/navigation-progress/navigation-progress.component'
import { FontService } from './core/services/font.service'
import { ThemeService } from './core/services/theme.service'

@Component({
  imports: [NavigationProgressComponent, RouterOutlet],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {
  constructor() {
    // Eagerly instantiate root-provided services so the theme/font document
    // classes apply on every page. Without this, FontService only constructs
    // when the Appearance form injects it (and ThemeService only via the
    // header ThemeSwitch), leaving public pages unstyled.
    const theme = inject(ThemeService)
    inject(FontService)

    // Keep the tab favicon in sync with the resolved theme.
    effect(() => {
      if (typeof document === 'undefined') return
      const icon = document.querySelector(
        'link[rel="icon"]'
      ) as HTMLLinkElement | null
      if (!icon) return
      icon.href =
        theme.resolvedTheme() === 'dark'
          ? '/images/logo-dark.webp'
          : '/images/logo-light.webp'
    })
  }
}
