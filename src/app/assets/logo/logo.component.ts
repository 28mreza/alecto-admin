import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core'
import { ThemeService } from '../../core/services/theme.service'

/**
 * Theme-aware app logo: `logo-dark.webp` (dark artwork) on the light theme,
 * `logo-light.webp` (light artwork) on the dark theme (resolved via
 * `ThemeService`), so the mark stays visible against the page background.
 * Sizing stays overridable via `className` (default `size-6`).
 */
@Component({
  selector: 'app-logo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <img
      [src]="logoSrc()"
      alt="Shadcn-Admin"
      width="24"
      height="24"
      [class]="'size-6 ' + className()"
    />
  `,
})
export class LogoComponent {
  readonly className = input('')

  private readonly themeService = inject(ThemeService)

  protected readonly logoSrc = computed(() =>
    this.themeService.resolvedTheme() === 'dark'
      ? '/images/logo-light.webp'
      : '/images/logo-dark.webp'
  )
}
