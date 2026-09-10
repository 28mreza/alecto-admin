import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, EventEmitter, Input, OnInit, Output, effect, forwardRef, inject, signal, viewChild } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideCheck, lucideChevronDown } from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmLabelImports } from '@spartan-ng/helm/label'
import { HlmPopoverImports } from '@spartan-ng/helm/popover'
import type { Option } from './registration-options'

/**
 * Full-width searchable single-select.
 * Same inline-popover pattern as the Tasks faceted filter: an outline
 * trigger button opening a popover with a search field and an option list.
 * Implements `ControlValueAccessor` so it works with `formControlName`;
 * parent owns the label and the validation message.
 */
@Component({
  selector: 'app-search-select-field',
  standalone: true,
  imports: [NgIcon, HlmButtonImports, HlmInputImports, HlmLabelImports, HlmPopoverImports],
  providers: [
    provideIcons({ lucideCheck, lucideChevronDown }),
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SearchSelectFieldComponent), multi: true },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <hlm-popover [state]="open()" (stateChanged)="open.set($event)" class="block w-full">
      <button
        #triggerBtn
        hlmBtn
        type="button"
        variant="outline"
        hlmPopoverTrigger
        class="w-full justify-between font-normal"
      >
        <span [class.text-muted-foreground]="!innerValue" class="truncate">{{
          displayLabel || placeholder
        }}</span>
        <ng-icon name="lucideChevronDown" class="text-muted-foreground size-4 shrink-0" />
      </button>
      <hlm-popover-content
        *hlmPopoverPortal
        class="max-w-[calc(100vw-2rem)] p-0"
        [style.width.px]="triggerWidth()"
      >
        <div class="p-2">
          <input
            hlmInput
            type="text"
            class="h-8"
            placeholder="Search options..."
            [attr.aria-label]="'Search ' + placeholder + ' options'"
            [value]="query()"
            (input)="onSearch($event)"
          />
        </div>
        <div class="max-h-60 overflow-y-auto p-1">
          @for (o of filtered(); track o.value) {
            <button
              type="button"
              class="hover:bg-accent flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm"
              (click)="choose(o.value)"
            >
              <span class="flex-1 truncate">{{ o.label }}</span>
              @if (o.value === innerValue) {
                <ng-icon name="lucideCheck" class="size-4 shrink-0" />
              }
            </button>
          } @empty {
            <p class="text-muted-foreground px-2 py-4 text-center text-sm">No results found.</p>
          }
        </div>
      </hlm-popover-content>
    </hlm-popover>
  `,
})
export class SearchSelectFieldComponent implements ControlValueAccessor, OnInit {
  @Input() options: Option[] = []
  @Input() placeholder = 'Select an option'
  @Input() value = ''
  @Output() valueChange = new EventEmitter<string>()

  protected readonly open = signal<'open' | 'closed'>('closed')
  protected innerValue = ''
  protected readonly query = signal('')
  protected readonly filtered = signal<Option[]>([])
  /** Live trigger width so the popover content matches it exactly. */
  protected readonly triggerWidth = signal<number | undefined>(undefined)
  private readonly triggerBtn = viewChild<ElementRef<HTMLButtonElement>>('triggerBtn')

  constructor() {
    const destroyRef = inject(DestroyRef)
    effect(() => {
      const el = this.triggerBtn()?.nativeElement
      if (!el || typeof ResizeObserver === 'undefined') return
      const update = (): void => {
        const w = el.getBoundingClientRect().width
        this.triggerWidth.set(w > 0 ? w : undefined)
      }
      update()
      const ro = new ResizeObserver(update)
      ro.observe(el)
      destroyRef.onDestroy(() => ro.disconnect())
    })
  }

  ngOnInit(): void {
    this.filtered.set([...this.options])
  }

  protected get displayLabel(): string {
    return this.options.find((o) => o.value === this.innerValue)?.label ?? ''
  }

  protected onSearch(event: Event): void {
    const q = (event.target as HTMLInputElement).value.trim().toLowerCase()
    this.query.set(q)
    this.filtered.set(
      !q
        ? [...this.options]
        : this.options.filter(
            (o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q),
          ),
    )
  }

  protected choose(v: string): void {
    this.setValue(v)
    this.open.set('closed')
  }

  private setValue(v: string | null | undefined): void {
    this.innerValue = v ?? ''
    this.value = this.innerValue
    this.valueChange.emit(this.innerValue)
    this.onChange(this.innerValue)
    this.onTouched()
  }

  private onChange: (v: string) => void = () => undefined
  private onTouched: () => void = () => undefined

  writeValue(value: string | null): void {
    this.innerValue = value ?? ''
    this.value = this.innerValue
    this.filtered.set([...this.options])
  }

  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }
}
