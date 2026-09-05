import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucidePlusCircle } from '@ng-icons/lucide'
import { HlmBadgeImports } from '@spartan-ng/helm/badge'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox'
import { HlmInputImports } from '@spartan-ng/helm/input'
import { HlmPopoverImports } from '@spartan-ng/helm/popover'
import { HlmSeparatorImports } from '@spartan-ng/helm/separator'
import { type TableEngine } from './table-engine'

export interface FacetOption {
  label: string
  value: string
  /**
   * ng-icon name rendered before the label (mirrors the source option
   * icons). Consumers register their icons via `provideIcons` (same
   * string-driven pattern as `NavGroup`); unknown names render nothing.
   */
  icon?: string
}

export interface DataTableFilterConfig {
  columnId: string
  title: string
  options: FacetOption[]
}

/**
 * Faceted (multi-value) column filter: a popover trigger showing the title
 * plus selected badges/count, with a checkbox list of options, live facet
 * counts from the engine, and a "Clear filters" action.
 */
@Component({
  selector: 'app-data-table-faceted-filter',
  standalone: true,
  imports: [
    NgIcon,
    HlmBadgeImports,
    HlmButtonImports,
    HlmCheckboxImports,
    HlmInputImports,
    HlmPopoverImports,
    HlmSeparatorImports,
  ],
  providers: [provideIcons({ lucidePlusCircle })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <hlm-popover align="start">
      <button
        hlmBtn
        variant="outline"
        size="sm"
        type="button"
        class="h-8 border-dashed"
        hlmPopoverTrigger
      >
        <ng-icon name="lucidePlusCircle" aria-hidden="true" class="size-4" />
        {{ title() }}
        @if (selected().size > 0) {
          <div hlmSeparator orientation="vertical" class="mx-2 h-4"></div>
          <span
            hlmBadge
            variant="secondary"
            class="rounded-sm px-1 font-normal lg:hidden"
          >
            {{ selected().size }}
          </span>
          <div class="hidden space-x-1 lg:flex">
            @if (selected().size > 2) {
              <span
                hlmBadge
                variant="secondary"
                class="rounded-sm px-1 font-normal"
              >
                {{ selected().size }} selected
              </span>
            } @else {
              @for (option of selectedOptions(); track option.value) {
                <span
                  hlmBadge
                  variant="secondary"
                  class="rounded-sm px-1 font-normal"
                >
                  @if (option.icon) {
                    <ng-icon
                      [name]="option.icon"
                      aria-hidden="true"
                      class="size-3"
                    />
                  }
                  {{ option.label }}
                </span>
              }
            }
          </div>
        }
      </button>
      <hlm-popover-content *hlmPopoverPortal class="w-[200px] p-0">
        <div class="p-2">
          <input
            hlmInput
            type="text"
            class="h-8"
            [placeholder]="title()"
            [value]="query()"
            (input)="onQuery($event)"
            [attr.aria-label]="'Filter ' + title() + ' options'"
          />
        </div>
        <div class="max-h-60 overflow-y-auto p-1">
          @for (option of visibleOptions(); track option.value) {
            <div
              class="hover:bg-accent flex items-center gap-2 rounded-md px-2 py-1.5"
            >
              <hlm-checkbox
                [checked]="selected().has(option.value)"
                (checkedChange)="setOption(option.value, $event)"
                [aria-label]="option.label"
              />
              <button
                type="button"
                class="flex flex-1 cursor-pointer items-center gap-2 text-left text-sm"
                (click)="toggleOption(option.value)"
              >
                @if (option.icon) {
                  <ng-icon
                    [name]="option.icon"
                    aria-hidden="true"
                    class="text-muted-foreground size-4"
                  />
                }
                <span>{{ option.label }}</span>
                @if (facetCounts().get(option.value); as count) {
                  <span class="text-muted-foreground ms-auto font-mono text-xs">
                    {{ count }}
                  </span>
                }
              </button>
            </div>
          } @empty {
            <p class="text-muted-foreground px-2 py-4 text-center text-sm">
              No results found.
            </p>
          }
        </div>
        @if (selected().size > 0) {
          <div class="border-t p-1">
            <button
              hlmBtn
              variant="ghost"
              size="sm"
              type="button"
              class="w-full justify-center"
              (click)="clearFilters()"
            >
              Clear filters
            </button>
          </div>
        }
      </hlm-popover-content>
    </hlm-popover>
  `,
})
export class DataTableFacetedFilterComponent<T extends { id: string }> {
  readonly engine = input.required<TableEngine<T>>()
  readonly columnId = input.required<string>()
  readonly title = input.required<string>()
  readonly options = input<FacetOption[]>([])

  protected readonly query = signal('')

  protected readonly selected = computed(
    () => new Set(this.engine().getColumnFilter(this.columnId()))
  )

  protected readonly facetCounts = computed(() => {
    const counts = new Map<string, number>()
    for (const facet of this.engine().facetValues(this.columnId())) {
      counts.set(facet.value, facet.count)
    }
    return counts
  })

  protected readonly selectedOptions = computed(() =>
    this.options().filter((option) => this.selected().has(option.value))
  )

  protected readonly visibleOptions = computed(() => {
    const needle = this.query().trim().toLowerCase()
    if (!needle) return this.options()
    return this.options().filter((option) =>
      option.label.toLowerCase().includes(needle)
    )
  })

  protected onQuery(event: Event): void {
    const target = event.target as HTMLInputElement | null
    if (target) this.query.set(target.value)
  }

  protected toggleOption(value: string): void {
    this.setOption(value, !this.selected().has(value))
  }

  protected setOption(value: string, checked: boolean): void {
    const next = new Set(this.selected())
    if (checked) next.add(value)
    else next.delete(value)
    this.engine().setColumnFilter(this.columnId(), [...next])
  }

  protected clearFilters(): void {
    this.engine().setColumnFilter(this.columnId(), [])
  }
}
