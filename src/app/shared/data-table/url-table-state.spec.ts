import { defaultTableState, TableEngine, type TableState } from './table-engine'
import { tableStateFromUrl, tableStateToUrl } from './url-table-state'

function fullState(overrides: Partial<TableState> = {}): TableState {
  return {
    ...defaultTableState(),
    ...overrides,
    pagination: {
      ...defaultTableState().pagination,
      ...overrides.pagination,
    },
  }
}

describe('url-table-state', () => {
  it('serializes an empty state to no params (clean URL)', () => {
    expect(tableStateToUrl(defaultTableState())).toEqual({})
  })

  it('serializes filter, column arrays, page and pageSize', () => {
    const url = tableStateToUrl(
      fullState({
        globalFilter: 'fix bug',
        columnFilters: [
          { id: 'status', value: ['todo', 'done'] },
          { id: 'priority', value: ['high'] },
          { id: 'role', value: ['admin'] },
        ],
        pagination: { pageIndex: 2, pageSize: 20 },
      })
    )
    expect(url).toEqual({
      filter: 'fix bug',
      status: ['todo', 'done'],
      priority: ['high'],
      role: ['admin'],
      page: 3,
      pageSize: 20,
    })
  })

  it('parses params back into a partial state (1-based page)', () => {
    const partial = tableStateFromUrl({
      filter: 'docs',
      status: ['todo', 'done'],
      priority: 'high',
      page: 3,
      pageSize: 20,
    })
    expect(partial).toEqual({
      globalFilter: 'docs',
      columnFilters: [
        { id: 'status', value: ['todo', 'done'] },
        { id: 'priority', value: ['high'] },
      ],
      pagination: { pageIndex: 2, pageSize: 20 },
    })
  })

  it('accepts string numbers from ActivatedRoute query params', () => {
    const partial = tableStateFromUrl({ page: '2', pageSize: '30' })
    expect(partial.pagination).toEqual({ pageIndex: 1, pageSize: 30 })
  })

  it('ignores reserved keys and empty values when parsing', () => {
    expect(tableStateFromUrl({})).toEqual({})
    expect(tableStateFromUrl({ filter: '', page: 1 })).toEqual({
      pagination: { pageIndex: 0 },
    })
  })

  it('supports the globalFilter alias key when parsing', () => {
    expect(tableStateFromUrl({ globalFilter: 'hello' })).toEqual({
      globalFilter: 'hello',
    })
  })

  it('round-trips state -> url -> state', () => {
    const state = fullState({
      globalFilter: 'audit',
      columnFilters: [
        { id: 'status', value: ['todo'] },
        { id: 'priority', value: ['high', 'medium'] },
      ],
      pagination: { pageIndex: 1, pageSize: 30 },
    })
    const url = tableStateToUrl(state)
    const partial = tableStateFromUrl(url)
    expect(partial.globalFilter).toBe(state.globalFilter)
    expect(partial.columnFilters).toEqual(state.columnFilters)
    expect(partial.pagination).toEqual(state.pagination)
  })

  it('round-trips the default state to empty params', () => {
    const url = tableStateToUrl(defaultTableState())
    expect(url).toEqual({})
    expect(tableStateFromUrl(url)).toEqual({})
  })

  it('omits pageSize when the URL has page but no pageSize', () => {
    const partial = tableStateFromUrl({ page: 2 })
    expect(partial.pagination).toEqual({ pageIndex: 1 })
    expect(partial.pagination).not.toHaveProperty('pageSize')
  })

  it('keeps the engine pageSize when applying a page-only partial', () => {
    interface SimpleRow {
      id: string
    }
    const data: SimpleRow[] = Array.from({ length: 50 }, (_, i) => ({
      id: `TASK-${i + 1}`,
    }))
    const engine = new TableEngine<SimpleRow>({ data, columns: [] })
    engine.setPageSize(20)
    engine.applyPartialState(tableStateFromUrl({ page: 2 }))
    expect(engine.state().pagination).toEqual({ pageIndex: 1, pageSize: 20 })
  })
})
