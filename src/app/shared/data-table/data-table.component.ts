import { NgTemplateOutlet } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  signal,
  DestroyRef,
  type TemplateRef,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ActivatedRoute, Router } from '@angular/router'
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox'
import { HlmTableImports } from '@spartan-ng/helm/table'
import { cn } from '../utils/cn'
import { DataTableBulkActionsComponent } from './data-table-bulk-actions.component'
import { DataTableColumnHeaderComponent } from './data-table-column-header.component'
import { DataTablePaginationComponent } from './data-table-pagination.component'
import {
  DataTableToolbarComponent,
  type DataTableFilterConfig,
} from './data-table-toolbar.component'
import {
  TableEngine,
  type GlobalFilterFn,
  type TableColumn,
} from './table-engine'
import {
  ownedUrlKeys,
  tableStateFromUrl,
  tableStateToUrl,
  type UrlQueryParams,
  type UrlQueryValue,
} from './url-table-state'

export type { DataTableFilterConfig }

/**
 * Arbitrary cell content keyed by column id. The template receives the row
 * as both `$implicit` and `row`:
 *
 * ```html
 * <app-data-table [columns]="columns" [data]="tasks"
 *   [cellTemplates]="{ status: statusTpl }">
 *   <ng-template #statusTpl let-row>
 *     <span hlmBadge>{{ row.status }}</span>
 *   </ng-template>
 * </app-data-table>
 * ```
 */
export type DataTableCellTemplates<T extends { id: string }> = Record<
  string,
  TemplateRef<{ $implicit: T; row: T }>
>

function normalizeUrlValue(value: UrlQueryValue): string | undefined {
  if (value === undefined || value === null) return undefined
  if (Array.isArray(value)) {
    if (value.length === 0) return undefined
    return [...value]
      .map((v) => String(v))
      .sort()
      .join(',')
  }
  const str = String(value)
  return str === '' ? undefined : str
}

/**
 * Generic data table: toolbar (search + faceted filters + view options),
 * bordered Spartan `hlm-table` with selection checkboxes, pagination and a
 * bulk-actions bar. Internal state lives in a `TableEngine`; with
 * `[urlSync]="true"` the filter/pagination state round-trips through the
 * URL query params (`filter`, `<columnId>[]`, `page`, `pageSize`). With
 * `[searchKey]` set, the search box drives that column's filter instead of
 * the global `filter` key (and the global filter stays disabled).
 */
@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    HlmCheckboxImports,
    HlmTableImports,
    DataTableBulkActionsComponent,
    DataTableColumnHeaderComponent,
    DataTablePaginationComponent,
    DataTableToolbarComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex flex-1 flex-col gap-4 max-sm:has-[div[role=toolbar]]:mb-16"
    >
      @if (showToolbar()) {
        <app-data-table-toolbar
          [engine]="engine"
          [searchPlaceholder]="searchPlaceholder()"
          [searchKey]="searchKey()"
          [filterConfigs]="filterConfigs()"
        />
      }
      <div class="overflow-hidden rounded-md border">
        <div hlmTableContainer>
          <table hlmTable [class]="tableClass()">
            <thead hlmTHead>
              <tr hlmTr>
                @if (showSelection()) {
                  <th hlmTh [class]="selectionCellClass()">
                    <hlm-checkbox
                      [checked]="engine.allRowSelection()"
                      [indeterminate]="engine.someRowSelection()"
                      (checkedChange)="engine.setAllRowsSelected($event)"
                      aria-label="Select all"
                    />
                  </th>
                }
                @for (column of engine.visibleColumns(); track column.id) {
                  <th hlmTh [class]="thClass(column)">
                    <app-data-table-column-header
                      [engine]="engine"
                      [columnId]="column.id"
                      [title]="column.header"
                    />
                  </th>
                }
              </tr>
            </thead>
            <tbody hlmTBody>
              @for (row of engine.rows(); track row.id) {
                <tr
                  hlmTr
                  [attr.data-state]="isRowSelected(row) ? 'selected' : null"
                >
                  @if (showSelection()) {
                    <td hlmTd [class]="selectionCellClass()">
                      <hlm-checkbox
                        [checked]="isRowSelected(row)"
                        (checkedChange)="
                          engine.toggleRowSelection(row.id, $event)
                        "
                        aria-label="Select row"
                      />
                    </td>
                  }
                  @for (column of engine.visibleColumns(); track column.id) {
                    <td hlmTd [class]="tdClass(column)">
                      @if (cellTemplates()[column.id]; as cellTpl) {
                        <ng-container
                          *ngTemplateOutlet="
                            cellTpl;
                            context: { $implicit: row, row: row }
                          "
                        />
                      } @else {
                        {{ engine.getDisplayValue(row, column) }}
                      }
                    </td>
                  }
                </tr>
              } @empty {
                <tr hlmTr>
                  <td hlmTd [colSpan]="colSpan()" class="h-24 text-center">
                    No results.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
      @if (showPagination()) {
        <app-data-table-pagination [engine]="engine" />
      }
      <app-data-table-bulk-actions
        [engine]="engine"
        [entityName]="entityName()"
      >
        <ng-content />
      </app-data-table-bulk-actions>
    </div>
  `,
})
export class DataTableComponent<T extends { id: string }> implements OnInit {
  readonly columns = input.required<TableColumn<T>[]>()
  readonly data = input<T[]>([])
  readonly urlSync = input(false)
  readonly searchPlaceholder = input('Filter...')
  /**
   * Column id the toolbar search is scoped to (mirrors the source
   * `DataTableToolbar` `searchKey` prop, e.g. `searchKey='username'` in the
   * users table). `null` (default) keeps the global-filter behavior: the
   * search box drives `filter` in state and URL. When set, the box drives
   * the column filter instead, so the URL key becomes the column id and the
   * (disabled, per source) global filter is neither read from nor written
   * to the URL.
   */
  readonly searchKey = input<string | null>(null)
  readonly filterConfigs = input<DataTableFilterConfig[]>([])
  readonly cellTemplates = input<DataTableCellTemplates<T>>({})
  readonly entityName = input('row')
  readonly showToolbar = input(true)
  readonly showPagination = input(true)
  readonly showSelection = input(true)
  /**
   * Extra classes merged onto the `<table>` element (the helm `hlmTable`
   * directive merges `class` bindings). Mirrors the source passing
   * `className` to `Table`, e.g. `min-w-xl` in the tasks table so narrow
   * viewports scroll horizontally instead of squeezing columns.
   */
  readonly tableClass = input('')
  /**
   * Extra classes merged onto the selection-checkbox `<th>`/`<td>` cells.
   * Mirrors the source `select` column `meta.className` (e.g. the users
   * table's `max-md:sticky` frozen select column; the tasks table's select
   * column has no meta, so it stays empty there).
   */
  readonly selectionCellClass = input('')
  /**
   * Optional override for the engine's global filter predicate. When set,
   * search matches only what this function allows (the tasks table passes a
   * matcher limited to id/title instead of the default match-everything).
   */
  readonly globalFilterFn = input<GlobalFilterFn<T> | undefined>(undefined)

  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private readonly destroyRef = inject(DestroyRef)

  readonly engine = new TableEngine<T>()

  private readonly currentQueryParams = signal<UrlQueryParams>({})
  private readonly urlSyncReady = signal(false)

  protected readonly colSpan = computed(
    () => this.engine.visibleColumns().length + (this.showSelection() ? 1 : 0)
  )

  constructor() {
    effect(() => {
      this.engine.setColumns(this.columns())
    })
    effect(() => {
      this.engine.setData(this.data())
    })
    effect(() => {
      const fn = this.globalFilterFn()
      if (fn) this.engine.setGlobalFilterFn(fn)
    })
    effect(() => {
      if (!this.urlSync() || !this.urlSyncReady()) return
      this.syncStateToUrl()
    })
  }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        this.currentQueryParams.set({ ...(params as UrlQueryParams) })
      })
    // Push inputs into the engine first so the URL partial below clamps
    // against the real page count (not an empty dataset).
    this.engine.setColumns(this.columns())
    this.engine.setData(this.data())
    const globalFilterFn = this.globalFilterFn()
    if (globalFilterFn) this.engine.setGlobalFilterFn(globalFilterFn)
    if (this.urlSync()) {
      const partial = tableStateFromUrl(
        this.route.snapshot.queryParams as UrlQueryParams
      )
      if (this.searchKey()) {
        // Global filter is disabled for column-scoped search tables (the
        // source passes `globalFilter: { enabled: false }` there).
        delete partial.globalFilter
      }
      if (Object.keys(partial).length > 0) {
        this.engine.applyPartialState(partial)
      }
    }
    this.urlSyncReady.set(true)
  }

  protected isRowSelected(row: T): boolean {
    return this.engine.state().rowSelection[row.id] === true
  }

  /**
   * Mirrors the source (`cn(meta.className, meta.thClassName)` on th,
   * `cn(meta.className, meta.tdClassName)` on td).
   */
  protected thClass(column: TableColumn<T>): string {
    return cn(column.meta?.className, column.meta?.thClassName)
  }

  protected tdClass(column: TableColumn<T>): string {
    return cn(column.meta?.className, column.meta?.tdClassName)
  }

  /**
   * Write engine state back to the URL, navigating only when the owned keys
   * actually differ from the current query params. Keys the table owns but
   * which are absent from the serialized state are sent as `null` so stale
   * values (e.g. a cleared filter) are removed instead of lingering via
   * `queryParamsHandling: 'merge'` — this comparison is what prevents
   * navigation loops.
   */
  private syncStateToUrl(): void {
    const state = this.engine.state()
    const target = tableStateToUrl(state)
    const current = this.currentQueryParams()
    const extraColumnIds = this.filterConfigs().map((config) => config.columnId)
    if (this.searchKey()) extraColumnIds.push(this.searchKey() as string)
    const owned = ownedUrlKeys(state, extraColumnIds)
    const differs = owned.some(
      (key) =>
        normalizeUrlValue(target[key]) !== normalizeUrlValue(current[key])
    )
    if (!differs) return
    const queryParams: Record<string, UrlQueryValue | null> = {}
    for (const key of owned) {
      queryParams[key] = target[key] ?? null
    }
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    })
  }
}
