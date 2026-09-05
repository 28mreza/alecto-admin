import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  NgZone,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core'
import { HlmPopoverImports } from '@spartan-ng/helm/popover'
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip'
import { cn } from '../../shared/utils/cn'

function isOverflown(element: HTMLElement | null): boolean {
  if (!element) return false
  return (
    element.offsetHeight < element.scrollHeight ||
    element.offsetWidth < element.scrollWidth
  )
}

/**
 * Truncating text with overflow detection.
 *
 * Ported from `shadcn-admin/src/components/long-text.tsx`: content is
 * projected (`<app-long-text className="max-w-36">…</app-long-text>`) and
 * always rendered truncated; when the text actually overflows, the full
 * value is additionally exposed via a tooltip on desktop
 * (`hidden sm:block`) and a popover on mobile (`sm:hidden`).
 *
 * Full tooltip/popover approach (not the native-`title` fallback): the
 * `HlmTooltipImports` (`[hlmTooltip]` template pattern, as used by the
 * tasks bulk actions) and `HlmPopoverImports` (trigger + portal content,
 * as used by the faceted filter) primitives already exist, so the port
 * stays faithful to the source at negligible cost.
 */
@Component({
  selector: 'app-long-text',
  standalone: true,
  imports: [HlmPopoverImports, HlmTooltipImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!overflown()) {
      <div #plain [class]="textClass()">
        <ng-content />
      </div>
    } @else {
      <div class="hidden sm:block">
        <div #tooltipAnchor [class]="textClass()" [hlmTooltip]="fullText">
          <ng-content />
        </div>
        <ng-template #fullText>
          <p [class]="contentClass()"><ng-content /></p>
        </ng-template>
      </div>
      <div class="sm:hidden">
        <hlm-popover>
          <div #popoverAnchor hlmPopoverTrigger [class]="textClass()">
            <ng-content />
          </div>
          <hlm-popover-content *hlmPopoverPortal [class]="popoverClass()">
            <p><ng-content /></p>
          </hlm-popover-content>
        </hlm-popover>
      </div>
    }
  `,
})
export class LongTextComponent implements AfterViewInit, OnDestroy {
  /** Extra classes for the truncated text (source `className`). */
  readonly className = input('')
  /** Extra classes for the expanded tooltip/popover content. */
  readonly contentClassName = input('')

  private readonly plain = viewChild<ElementRef<HTMLElement>>('plain')
  private readonly tooltipAnchor =
    viewChild<ElementRef<HTMLElement>>('tooltipAnchor')
  private readonly popoverAnchor =
    viewChild<ElementRef<HTMLElement>>('popoverAnchor')

  protected readonly overflown = signal(false)

  private resizeHandler: (() => void) | null = null

  private readonly zone = inject(NgZone)

  protected textClass(): string {
    return cn('truncate', this.className())
  }

  protected contentClass(): string {
    return cn(this.contentClassName())
  }

  protected popoverClass(): string {
    return cn('w-fit', this.contentClassName())
  }

  ngAfterViewInit(): void {
    this.checkOverflow()
    // Re-check when the viewport changes (mirrors the source, which only
    // checks on mount — resize keeps the signal truthful here).
    this.zone.runOutsideAngular(() => {
      const handler = (): void => this.zone.run(() => this.checkOverflow())
      this.resizeHandler = handler
      window.addEventListener('resize', handler)
    })
  }

  ngOnDestroy(): void {
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler)
      this.resizeHandler = null
    }
  }

  private checkOverflow(): void {
    const element =
      this.tooltipAnchor()?.nativeElement ??
      this.popoverAnchor()?.nativeElement ??
      this.plain()?.nativeElement ??
      null
    this.overflown.set(isOverflown(element))
  }
}
