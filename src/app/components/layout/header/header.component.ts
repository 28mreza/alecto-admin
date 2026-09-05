import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  signal,
} from '@angular/core'
import { HlmSeparatorImports } from '@spartan-ng/helm/separator'
import { SidebarTriggerComponent } from '../sidebar/sidebar-trigger.component'
import { cn } from '../../../shared/utils/cn'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SidebarTriggerComponent, HlmSeparatorImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header [class]="headerClasses()">
      <div [class]="innerClasses()">
        <app-sidebar-trigger variant="outline" class="max-md:scale-125" />
        <hlm-separator orientation="vertical" class="h-6" />
        <ng-content />
      </div>
    </header>
  `,
})
export class HeaderComponent {
  readonly fixed = input(false)
  readonly className = input('')

  protected readonly offset = signal(0)

  private readonly destroyRef = inject(DestroyRef)

  constructor() {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return
    }
    // Window scroll covers document scrolling; the document capture listener
    // additionally catches inner scroll containers (fixed panels, sheets).
    const onScroll = (event?: Event): void => {
      let y =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0
      const target = event?.target as Element | null
      if (
        target instanceof HTMLElement &&
        target !== document.body &&
        target !== document.documentElement
      ) {
        y = Math.max(y, target.scrollTop)
      }
      this.offset.set(y)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('scroll', onScroll, {
      capture: true,
      passive: true,
    })
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('scroll', onScroll, { capture: true })
    })
  }

  protected readonly headerClasses = computed(() =>
    cn(
      'z-50 h-16',
      this.fixed() && 'header-fixed peer/header sticky top-0 w-[inherit]',
      this.offset() > 10 && this.fixed()
        ? 'shadow bg-background/20 backdrop-blur-lg'
        : 'shadow-none',
      this.className()
    )
  )

  protected readonly innerClasses = computed(() =>
    ['relative flex h-full items-center gap-3 p-4 sm:gap-4'].join(' ')
  )
}
