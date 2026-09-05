import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core'
import { LayoutService } from '../../../core/services/layout.service'
import { cn } from '../../../shared/utils/cn'

@Component({
  selector: 'app-main',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main
      [attr.data-layout]="fixed() ? 'fixed' : 'auto'"
      [class]="mainClasses()"
    >
      <ng-content />
    </main>
  `,
})
export class MainComponent {
  readonly fixed = input(false)

  /**
   * Explicit per-page override. When undefined (default), the global
   * content-width preference from `LayoutService` applies: `full` behaves
   * fluid (no max-width), `compact` constrains to `max-w-7xl`.
   */
  readonly fluid = input<boolean | undefined>(undefined)

  readonly className = input('')

  private readonly layoutService = inject(LayoutService)

  protected readonly effectiveFluid = computed(
    () => this.fluid() ?? this.layoutService.contentWidth() === 'full'
  )

  protected readonly mainClasses = computed(() =>
    cn(
      'px-4 py-6',
      this.fixed() && 'flex grow flex-col overflow-hidden',
      !this.effectiveFluid() &&
        '@7xl/content:mx-auto @7xl/content:w-full @7xl/content:max-w-7xl',
      this.className()
    )
  )
}
