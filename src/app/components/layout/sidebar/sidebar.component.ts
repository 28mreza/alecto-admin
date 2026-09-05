import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core'
import {
  LayoutService,
  type Collapsible,
  type Variant,
} from '../../../core/services/layout.service'

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    'data-slot': 'sidebar',
    '[style.width]': "collapsible() === 'none' ? 'var(--sidebar-width)' : null",
  },
  template: `
    @if (collapsible() === 'none') {
      <div
        class="bg-sidebar text-sidebar-foreground flex h-full w-full flex-col"
        data-slot="sidebar-inner"
        [attr.data-variant]="layoutService.variant()"
      >
        <ng-content />
      </div>
    } @else {
      <div data-slot="sidebar-gap" [class]="gapClass()"></div>
      <div
        data-slot="sidebar-container"
        [class]="containerClass()"
        [attr.data-variant]="layoutService.variant()"
      >
        <div data-slot="sidebar-inner" [class]="innerClass()">
          <ng-content />
        </div>
      </div>
    }
  `,
})
export class SidebarComponent {
  readonly layoutService = inject(LayoutService)

  readonly collapsible = input<Collapsible>('icon')
  readonly variant = input<Variant>('inset')

  readonly hostClass = computed(() =>
    this.collapsible() === 'none'
      ? 'flex h-full w-full flex-col bg-sidebar text-sidebar-foreground'
      : 'hidden text-sidebar-foreground md:block'
  )

  readonly gapClass = computed(() =>
    [
      'relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear',
      'group-data-[collapsible=offcanvas]:w-0',
      this.variant() === 'floating' || this.variant() === 'inset'
        ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
        : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
    ].join(' ')
  )

  readonly containerClass = computed(() =>
    [
      'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[inset-inline,width] duration-200 ease-linear md:flex',
      'inset-s-0 group-data-[collapsible=offcanvas]:-inset-s-[calc(var(--sidebar-width))]',
      this.variant() === 'floating' || this.variant() === 'inset'
        ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
        : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-e',
    ].join(' ')
  )

  readonly innerClass = computed(() =>
    [
      'flex h-full w-full flex-col bg-sidebar',
      this.variant() === 'floating'
        ? 'group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow-sm'
        : '',
    ].join(' ')
  )
}
