import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideCalendar } from '@ng-icons/lucide'
import type { BrnOverlayState } from '@spartan-ng/brain/overlay'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmCalendar } from '@spartan-ng/helm/calendar'
import { HlmPopoverImports } from '@spartan-ng/helm/popover'
import { format } from 'date-fns'

const MIN_SELECTABLE_DATE = new Date('1900-01-01')

/**
 * Date picker ported from `shadcn-admin/src/components/date-picker.tsx`.
 * Outline trigger button showing the formatted date (or placeholder) with a
 * calendar icon, opening a popover with a single-select dropdown calendar.
 * Future dates and dates before 1900-01-01 are disabled.
 */
@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [NgIcon, HlmButtonImports, HlmCalendar, HlmPopoverImports],
  providers: [provideIcons({ lucideCalendar })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <hlm-popover
      sideOffset="5"
      [state]="popoverState()"
      (stateChanged)="onStateChange($event)"
    >
      <button
        hlmBtn
        hlmPopoverTrigger
        variant="outline"
        type="button"
        class="data-[empty=true]:text-muted-foreground w-60 justify-start text-start font-normal"
        [attr.data-empty]="!selected()"
        [attr.id]="buttonId()"
      >
        @if (formattedDate(); as label) {
          {{ label }}
        } @else {
          <span>{{ placeholder() }}</span>
        }
        <ng-icon
          name="lucideCalendar"
          aria-hidden="true"
          class="ms-auto h-4 w-4 opacity-50"
        />
      </button>
      <hlm-popover-content *hlmPopoverPortal class="w-auto p-0">
        <hlm-calendar
          captionLayout="dropdown"
          [date]="selected()"
          [dateDisabled]="isDateDisabled"
          (dateChange)="onSelect($event)"
        />
      </hlm-popover-content>
    </hlm-popover>
  `,
})
export class DatePickerComponent {
  readonly selected = input<Date | undefined>(undefined)
  readonly placeholder = input('Pick a date')
  /** Optional id for the trigger button (e.g. for associating a label). */
  readonly buttonId = input<string | undefined>(undefined)
  readonly selectedChange = output<Date | undefined>()

  protected readonly formattedDate = computed(() => {
    const date = this.selected()
    return date ? format(date, 'MMM d, yyyy') : undefined
  })

  protected readonly popoverState = signal<BrnOverlayState | null>(null)

  protected onStateChange(state: BrnOverlayState): void {
    this.popoverState.set(state)
  }

  protected readonly isDateDisabled = (date: Date): boolean =>
    date > new Date() || date < MIN_SELECTABLE_DATE

  protected onSelect(date: unknown): void {
    this.selectedChange.emit((date ?? undefined) as Date | undefined)
    this.popoverState.set('closed')
  }
}
