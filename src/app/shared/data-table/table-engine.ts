import {
  computed,
  signal,
  type Signal,
  type WritableSignal,
} from '@angular/core'

export type SortDirection = 'asc' | 'desc'

export interface ColumnSort {
  column: string
  direction: SortDirection
}

export interface ColumnFilter {
  id: string
  value: string[]
}

export interface TablePagination {
  pageIndex: number
  pageSize: number
}

export interface TableState {
  globalFilter: string
  columnFilters: ColumnFilter[]
  sorting: ColumnSort[]
  pagination: TablePagination
  rowSelection: Record<string, boolean>
  columnVisibility: Record<string, boolean>
}

export interface TableColumn<T> {
  id: string
  header: string
  accessorFn?: (row: T) => unknown
  cell?: (row: T) => string
  enableSorting?: boolean
  enableHiding?: boolean
  enableGlobalFilter?: boolean
  /**
   * How a column filter on this column matches rows. `exact` (default) is
   * the faceted-filter membership check; `contains` is the case-insensitive
   * substring match the source TanStack tables use for `type: 'string'`
   * column filters (e.g. the users table's `username` search box).
   */
  filterMode?: 'exact' | 'contains'
  meta?: { className?: string; thClassName?: string; tdClassName?: string }
}

export interface FacetValue {
  value: string
  count: number
}

export interface TableEngineOptions<T extends { id: string }> {
  data?: T[]
  columns?: TableColumn<T>[]
  initialState?: Partial<TableState>
  globalFilterFn?: GlobalFilterFn<T>
}

export type GlobalFilterFn<T extends { id: string }> = (
  row: T,
  filter: string,
  columns: TableColumn<T>[],
  getCellValue: (row: T, columnId: string) => unknown
) => boolean

export const DEFAULT_PAGE_SIZE = 10
export const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50] as const

export function defaultTableState(): TableState {
  return {
    globalFilter: '',
    columnFilters: [],
    sorting: [],
    pagination: { pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE },
    rowSelection: {},
    columnVisibility: {},
  }
}

function stringifyCellValue(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (Array.isArray(value)) return value.map((v) => String(v)).join(' ')
  return String(value)
}

/**
 * Default global filter: case-insensitive "contains" across every column
 * that does not opt out via `enableGlobalFilter: false`. Consumers (e.g. the
 * tasks table, which only matches id/title) can override via
 * `TableEngineOptions.globalFilterFn`.
 */
export function defaultGlobalFilterFn<T extends { id: string }>(
  row: T,
  filter: string,
  columns: TableColumn<T>[],
  getCellValue: (row: T, columnId: string) => unknown
): boolean {
  const needle = filter.trim().toLowerCase()
  if (!needle) return true
  return columns
    .filter((column) => column.enableGlobalFilter !== false)
    .some((column) =>
      stringifyCellValue(getCellValue(row, column.id))
        .toLowerCase()
        .includes(needle)
    )
}

function compareCellValues(
  a: unknown,
  b: unknown,
  direction: SortDirection
): number {
  const multiplier = direction === 'asc' ? 1 : -1
  const aEmpty = a === null || a === undefined || a === ''
  const bEmpty = b === null || b === undefined || b === ''
  if (aEmpty && bEmpty) return 0
  if (aEmpty) return 1
  if (bEmpty) return -1
  if (typeof a === 'number' && typeof b === 'number') {
    return (a - b) * multiplier
  }
  const aStr = String(a).toLowerCase()
  const bStr = String(b).toLowerCase()
  if (aStr < bStr) return -1 * multiplier
  if (aStr > bStr) return 1 * multiplier
  return 0
}

/**
 * Pure, signal-based table logic (no DOM): filtering, faceting, stable
 * sorting, pagination and row selection. Consumed by `DataTableComponent`
 * and directly unit-testable.
 */
export class TableEngine<T extends { id: string }> {
  private readonly _data = signal<T[]>([])
  private readonly _columns = signal<TableColumn<T>[]>([])
  private _globalFilterFn: GlobalFilterFn<T>

  readonly state: WritableSignal<TableState>

  constructor(options?: TableEngineOptions<T>) {
    this._globalFilterFn = options?.globalFilterFn ?? defaultGlobalFilterFn
    this.state = signal({
      ...defaultTableState(),
      ...options?.initialState,
      pagination: {
        ...defaultTableState().pagination,
        ...options?.initialState?.pagination,
      },
    })
    if (options?.data) this._data.set([...options.data])
    if (options?.columns) this._columns.set([...options.columns])
    this.clampPageIndex()
  }

  readonly data: Signal<T[]> = this._data.asReadonly()
  readonly columns: Signal<TableColumn<T>[]> = this._columns.asReadonly()

  setData(data: T[]): void {
    this._data.set([...data])
    this.clampPageIndex()
  }

  setColumns(columns: TableColumn<T>[]): void {
    this._columns.set([...columns])
    this.clampPageIndex()
  }

  /**
   * Swap the global filter predicate after construction (e.g. via the
   * `DataTableComponent.globalFilterFn` input). Needed by consumers like the
   * tasks table that only match a subset of columns (id/title).
   */
  setGlobalFilterFn(fn: GlobalFilterFn<T>): void {
    this._globalFilterFn = fn
  }

  /** Columns that are not hidden via `columnVisibility`. */
  readonly visibleColumns: Signal<TableColumn<T>[]> = computed(() => {
    const visibility = this.state().columnVisibility
    return this._columns().filter((column) => visibility[column.id] !== false)
  })

  /** Columns that can be toggled from the "View" options menu. */
  readonly hideableColumns: Signal<TableColumn<T>[]> = computed(() =>
    this._columns().filter((column) => column.enableHiding !== false)
  )

  /** Rows after global + column filters (before sorting/pagination). */
  readonly filteredRows: Signal<T[]> = computed(() => {
    const { globalFilter, columnFilters } = this.state()
    const data = this._data()
    const columns = this._columns()
    return data.filter(
      (row) =>
        this._globalFilterFn(row, globalFilter, columns, (r, id) =>
          this.getCellValue(r, id)
        ) &&
        matchesColumnFilters(row, columnFilters, columns, (r, id) =>
          this.getCellValue(r, id)
        )
    )
  })

  /** Filtered rows with stable multi-column sorting applied. */
  readonly sortedRows: Signal<T[]> = computed(() => {
    const { sorting } = this.state()
    const rows = [...this.filteredRows()]
    if (sorting.length === 0) return rows
    const sortable = new Set(
      this._columns()
        .filter((column) => column.enableSorting !== false)
        .map((column) => column.id)
    )
    const active = sorting.filter((sort) => sortable.has(sort.column))
    if (active.length === 0) return rows
    rows.sort((a, b) => {
      for (const sort of active) {
        const result = compareCellValues(
          this.getCellValue(a, sort.column),
          this.getCellValue(b, sort.column),
          sort.direction
        )
        if (result !== 0) return result
      }
      return 0
    })
    return rows
  })

  readonly pageCount: Signal<number> = computed(() => {
    const total = this.sortedRows().length
    const pageSize = Math.max(1, this.state().pagination.pageSize)
    return Math.ceil(total / pageSize)
  })

  /** Current page slice; the page index is defensively clamped. */
  readonly rows: Signal<T[]> = computed(() => {
    const sorted = this.sortedRows()
    const { pageIndex, pageSize } = this.state().pagination
    const safePageSize = Math.max(1, pageSize)
    const pageCount = Math.ceil(sorted.length / safePageSize)
    const safeIndex = Math.min(
      Math.max(0, pageIndex),
      Math.max(0, pageCount - 1)
    )
    return sorted.slice(
      safeIndex * safePageSize,
      safeIndex * safePageSize + safePageSize
    )
  })

  /** Selected rows within the current filtered set. */
  readonly selectedRows: Signal<T[]> = computed(() => {
    const selection = this.state().rowSelection
    return this.filteredRows().filter((row) => selection[row.id] === true)
  })

  readonly allRowSelection: Signal<boolean> = computed(() => {
    const filtered = this.filteredRows()
    if (filtered.length === 0) return false
    const selection = this.state().rowSelection
    return filtered.every((row) => selection[row.id] === true)
  })

  readonly someRowSelection: Signal<boolean> = computed(() => {
    const filtered = this.filteredRows()
    if (filtered.length === 0) return false
    const selection = this.state().rowSelection
    const selectedCount = filtered.filter(
      (row) => selection[row.id] === true
    ).length
    return selectedCount > 0 && selectedCount < filtered.length
  })

  readonly isFiltered: Signal<boolean> = computed(() => {
    const { globalFilter, columnFilters } = this.state()
    return globalFilter.trim() !== '' || columnFilters.length > 0
  })

  getCellValue(row: T, columnId: string): unknown {
    const column = this._columns().find((c) => c.id === columnId)
    if (column?.accessorFn) return column.accessorFn(row)
    return (row as unknown as Record<string, unknown>)[columnId]
  }

  getDisplayValue(row: T, column: TableColumn<T>): string {
    if (column.cell) return column.cell(row)
    return stringifyCellValue(this.getCellValue(row, column.id))
  }

  getColumnFilter(columnId: string): string[] {
    return (
      this.state().columnFilters.find((filter) => filter.id === columnId)
        ?.value ?? []
    )
  }

  getSort(columnId: string): SortDirection | null {
    return (
      this.state().sorting.find((sort) => sort.column === columnId)
        ?.direction ?? null
    )
  }

  isColumnVisible(columnId: string): boolean {
    return this.state().columnVisibility[columnId] !== false
  }

  /**
   * Unique value counts for a column, computed from rows filtered by the
   * global filter and every *other* column filter (mirrors TanStack's
   * faceted-unique-values so counts stay useful while filtering).
   */
  facetValues(columnId: string): FacetValue[] {
    const { globalFilter, columnFilters } = this.state()
    const columns = this._columns()
    const others = columnFilters.filter((filter) => filter.id !== columnId)
    const counts = new Map<string, number>()
    for (const row of this._data()) {
      if (
        !this._globalFilterFn(row, globalFilter, columns, (r, id) =>
          this.getCellValue(r, id)
        )
      ) {
        continue
      }
      if (
        !matchesColumnFilters(row, others, columns, (r, id) =>
          this.getCellValue(r, id)
        )
      ) {
        continue
      }
      const raw = this.getCellValue(row, columnId)
      const values = Array.isArray(raw)
        ? raw.map((v) => String(v))
        : [stringifyCellValue(raw)]
      for (const value of values) {
        if (value === '') continue
        counts.set(value, (counts.get(value) ?? 0) + 1)
      }
    }
    return [...counts.entries()]
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count || (a.value < b.value ? -1 : 1))
  }

  setGlobalFilter(value: string): void {
    this.state.update((prev) => ({
      ...prev,
      globalFilter: value,
      pagination: { ...prev.pagination, pageIndex: 0 },
    }))
  }

  setSorting(sorting: ColumnSort[]): void {
    this.state.update((prev) => ({ ...prev, sorting: [...sorting] }))
  }

  /**
   * Sort cycle for a single column: none -> asc -> desc -> none.
   * With `multi`, each column keeps its own entry instead of replacing.
   */
  toggleSorting(columnId: string, multi = false): void {
    const column = this._columns().find((c) => c.id === columnId)
    if (column && column.enableSorting === false) return
    this.state.update((prev) => {
      const existing = prev.sorting.find((sort) => sort.column === columnId)
      let step: ColumnSort[] = []
      if (!existing) {
        step = [{ column: columnId, direction: 'asc' }]
      } else if (existing.direction === 'asc') {
        step = [{ column: columnId, direction: 'desc' }]
      }
      return {
        ...prev,
        sorting: multi
          ? [...prev.sorting.filter((s) => s.column !== columnId), ...step]
          : step,
      }
    })
  }

  setColumnFilter(columnId: string, values: string[]): void {
    this.state.update((prev) => {
      const rest = prev.columnFilters.filter((filter) => filter.id !== columnId)
      return {
        ...prev,
        columnFilters:
          values.length > 0
            ? [...rest, { id: columnId, value: [...values] }]
            : rest,
        pagination: { ...prev.pagination, pageIndex: 0 },
      }
    })
  }

  resetColumnFilters(): void {
    this.state.update((prev) => ({
      ...prev,
      columnFilters: [],
      pagination: { ...prev.pagination, pageIndex: 0 },
    }))
  }

  resetAllFilters(): void {
    this.state.update((prev) => ({
      ...prev,
      globalFilter: '',
      columnFilters: [],
      pagination: { ...prev.pagination, pageIndex: 0 },
    }))
  }

  setPageIndex(pageIndex: number): void {
    const clamped = Math.min(
      Math.max(0, pageIndex),
      Math.max(0, this.pageCount() - 1)
    )
    this.state.update((prev) => ({
      ...prev,
      pagination: { ...prev.pagination, pageIndex: clamped },
    }))
  }

  /**
   * Clamp the state's pageIndex into `[0, pageCount - 1]` (the state-level
   * equivalent of the source `ensurePageInRange`). Runs after anything that
   * can shrink the page count — data/columns swaps and partial (URL)
   * applies — so a deep-linked `?page=99` corrects in state and the
   * URL-sync effect then rewrites the URL. No-op when already in range.
   */
  clampPageIndex(): void {
    const current = this.state().pagination.pageIndex
    const clamped = Math.min(
      Math.max(0, current),
      Math.max(0, this.pageCount() - 1)
    )
    if (clamped !== current) {
      this.state.update((prev) => ({
        ...prev,
        pagination: { ...prev.pagination, pageIndex: clamped },
      }))
    }
  }

  setPageSize(pageSize: number): void {
    const safePageSize = Math.max(1, pageSize)
    this.state.update((prev) => {
      const pageCount = Math.max(
        1,
        Math.ceil(this.sortedRows().length / safePageSize)
      )
      return {
        ...prev,
        pagination: {
          pageSize: safePageSize,
          pageIndex: Math.min(prev.pagination.pageIndex, pageCount - 1),
        },
      }
    })
  }

  setColumnVisibility(columnId: string, visible: boolean): void {
    this.state.update((prev) => ({
      ...prev,
      columnVisibility: { ...prev.columnVisibility, [columnId]: visible },
    }))
  }

  toggleColumnVisibility(columnId: string): void {
    this.setColumnVisibility(columnId, !this.isColumnVisible(columnId))
  }

  toggleRowSelection(id: string, selected: boolean): void {
    this.state.update((prev) => {
      const rowSelection = { ...prev.rowSelection }
      if (selected) {
        rowSelection[id] = true
      } else {
        delete rowSelection[id]
      }
      return { ...prev, rowSelection }
    })
  }

  setAllRowsSelected(selected: boolean): void {
    this.state.update((prev) => {
      if (!selected) return { ...prev, rowSelection: {} }
      const next: Record<string, boolean> = { ...prev.rowSelection }
      for (const row of this.filteredRows()) next[row.id] = true
      return { ...prev, rowSelection: next }
    })
  }

  toggleAllRows(): void {
    this.setAllRowsSelected(!this.allRowSelection())
  }

  resetRowSelection(): void {
    this.state.update((prev) => ({ ...prev, rowSelection: {} }))
  }

  /** Merge a partial state (e.g. parsed from URL query params). */
  applyPartialState(partial: Partial<TableState>): void {
    this.state.update((prev) => ({
      ...prev,
      ...partial,
      pagination: { ...prev.pagination, ...partial.pagination },
    }))
    this.clampPageIndex()
  }
}

function matchesColumnFilters<T extends { id: string }>(
  row: T,
  columnFilters: ColumnFilter[],
  columns: TableColumn<T>[],
  getCellValue: (row: T, columnId: string) => unknown
): boolean {
  return columnFilters.every((filter) => {
    if (filter.value.length === 0) return true
    const raw = getCellValue(row, filter.id)
    const cellValues = Array.isArray(raw)
      ? raw.map((v) => String(v))
      : [stringifyCellValue(raw)]
    if (
      columns.find((column) => column.id === filter.id)?.filterMode ===
      'contains'
    ) {
      const needle = filter.value.join(' ').trim().toLowerCase()
      if (needle === '') return true
      return cellValues.some((cellValue) =>
        cellValue.toLowerCase().includes(needle)
      )
    }
    return cellValues.some((cellValue) => filter.value.includes(cellValue))
  })
}
