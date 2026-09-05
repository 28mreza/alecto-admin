import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { NgIcon, provideIcons } from '@ng-icons/core'
import { lucideX } from '@ng-icons/lucide'
import { HlmButtonImports } from '@spartan-ng/helm/button'
import { HlmInputImports } from '@spartan-ng/helm/input'
import {
  DataTableFacetedFilterComponent,
  type DataTableFilterConfig,
} from './data-table-faceted-filter.component'
import { DataTableViewOptionsComponent } from './data-table-view-options.component'
import { type TableEngine } from './table-engine'

export type { DataTableFilterConfig }

/**
 * Toolbar: search input + one faceted filter per config + "Reset"
 * (shown while filtered) + column view options.
 */
@Component({
  selector: 'app-data-table-toolbar',
  standalone: true,
  imports: [
    NgIcon,
    HlmButtonImports,
    HlmInputImports,
    DataTableFacetedFilterComponent,
    DataTableViewOptionsComponent,
  ],
  providers: [provideIcons({ lucideX })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center justify-between">
      <div
        class="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2"
      >
        <input
          hlmInput
          type="text"
          class="h-8 w-[150px] lg:w-[250px]"
          [placeholder]="searchPlaceholder()"
          [value]="searchValue()"
          (input)="onSearch($event)"
          aria-label="Search"
        />
        <div class="flex gap-x-2">
          @for (config of filterConfigs(); track config.columnId) {
            <app-data-table-faceted-filter
              [engine]="engine()"
              [columnId]="config.columnId"
              [title]="config.title"
              [options]="config.options"
            />
          }
        </div>
        @if (engine().isFiltered()) {
          <button
            hlmBtn
            variant="ghost"
            type="button"
            class="h-8 px-2 lg:px-3"
            (click)="resetFilters()"
          >
            Reset
            <ng-icon name="lucideX" aria-hidden="true" class="ms-2 size-4" />
          </button>
        }
      </div>
      <app-data-table-view-options [engine]="engine()" />
    </div>
  `,
})
export class DataTableToolbarComponent<T extends { id: string }> {
  readonly engine = input.required<TableEngine<T>>()
  readonly searchPlaceholder = input('Filter...')
  readonly filterConfigs = input<DataTableFilterConfig[]>([])
  /**
   * Column id the search input is scoped to (mirrors the source
   * `DataTableToolbar` `searchKey` prop). `null` (default) keeps the
   * global-filter behavior.
   */
  readonly searchKey = input<string | null>(null)

  protected searchValue(): string {
    const key = this.searchKey()
    if (key) return this.engine().getColumnFilter(key)[0] ?? ''
    return this.engine().state().globalFilter
  }

  protected onSearch(event: Event): void {
    const target = event.target as HTMLInputElement | null
    if (!target) return
    const key = this.searchKey()
    if (key) {
      const text = target.value
      this.engine().setColumnFilter(key, text ? [text] : [])
      return
    }
    this.engine().setGlobalFilter(target.value)
  }

  protected resetFilters(): void {
    this.engine().resetAllFilters()
  }
}
