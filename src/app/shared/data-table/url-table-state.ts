import { DEFAULT_PAGE_SIZE, type TableState } from './table-engine'

/**
 * Query-param keys owned by the table. `filter` is the canonical global
 * filter key (mirrors `use-table-url-state.ts` in the source, where the
 * global filter syncs to the `filter` search key); `globalFilter` is accepted
 * as an alias when parsing. `page` is 1-based in the URL and maps to the
 * 0-based `pagination.pageIndex` in state.
 */
export const URL_TABLE_RESERVED_KEYS = [
  'filter',
  'globalFilter',
  'page',
  'pageSize',
]

export type UrlQueryValue = string | string[] | number | undefined

export type UrlQueryParams = Record<string, UrlQueryValue>

/**
 * Parse URL query params into a partial table state. Any non-reserved key
 * holding a string or string array becomes a generic multi-value column
 * filter keyed by column id (e.g. `status`, `priority`, `role`).
 */
export function tableStateFromUrl(params: UrlQueryParams): Partial<TableState> {
  const partial: Partial<TableState> = {}

  const rawGlobal = params['filter'] ?? params['globalFilter']
  if (typeof rawGlobal === 'string' && rawGlobal !== '') {
    partial.globalFilter = rawGlobal
  }

  const columnFilters: { id: string; value: string[] }[] = []
  for (const [key, value] of Object.entries(params)) {
    if (URL_TABLE_RESERVED_KEYS.includes(key)) continue
    if (typeof value === 'string' && value !== '') {
      columnFilters.push({ id: key, value: [value] })
    } else if (Array.isArray(value) && value.length > 0) {
      columnFilters.push({ id: key, value: [...value] })
    }
  }
  if (columnFilters.length > 0) partial.columnFilters = columnFilters

  const pageIndex = parsePageIndex(params['page'])
  const pageSize = parsePositiveInt(params['pageSize'])
  if (pageIndex !== undefined || pageSize !== undefined) {
    // When a key is absent from the URL its current engine value must be
    // preserved: `applyPartialState` merges pagination, so omitting the
    // missing key (instead of filling the default) keeps a non-default
    // pageSize intact on back/forward navigation.
    partial.pagination = {
      pageIndex: pageIndex ?? 0,
      ...(pageSize !== undefined ? { pageSize } : {}),
    } as TableState['pagination']
  }

  return partial
}

/**
 * Serialize table state to URL query params. Defaults are omitted so the URL
 * stays clean (empty filter, page 1 and the default page size produce no
 * keys) — this matches the source `use-table-url-state` behavior.
 */
export function tableStateToUrl(state: TableState): UrlQueryParams {
  const params: UrlQueryParams = {}

  if (state.globalFilter.trim() !== '') {
    params['filter'] = state.globalFilter
  }
  for (const filter of state.columnFilters) {
    if (filter.value.length > 0) params[filter.id] = [...filter.value]
  }
  if (state.pagination.pageIndex > 0) {
    params['page'] = state.pagination.pageIndex + 1
  }
  if (state.pagination.pageSize !== DEFAULT_PAGE_SIZE) {
    params['pageSize'] = state.pagination.pageSize
  }

  return params
}

/**
 * Column ids from the toolbar config whose URL keys the table owns even when
 * they currently hold no value (needed so clearing a filter removes its key).
 */
export function ownedUrlKeys(
  state: TableState,
  extraColumnIds: string[] = []
): string[] {
  const keys = new Set<string>([
    'filter',
    'page',
    'pageSize',
    ...extraColumnIds,
    ...state.columnFilters.map((filter) => filter.id),
  ])
  return [...keys]
}

function parsePageIndex(value: UrlQueryValue): number | undefined {
  const page = parsePositiveInt(value)
  if (page === undefined) return undefined
  return Math.max(0, page - 1)
}

function parsePositiveInt(value: UrlQueryValue): number | undefined {
  if (typeof value === 'number' && Number.isInteger(value) && value > 0) {
    return value
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    if (Number.isInteger(parsed) && parsed > 0) return parsed
  }
  return undefined
}
