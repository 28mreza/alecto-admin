import { TableEngine, type TableColumn } from './table-engine'

interface Row {
  id: string
  title: string
  status: string
  priority: string
  count: number
}

const COLUMNS: TableColumn<Row>[] = [
  { id: 'id', header: 'ID' },
  { id: 'title', header: 'Title' },
  { id: 'status', header: 'Status' },
  { id: 'priority', header: 'Priority' },
  { id: 'count', header: 'Count' },
]

const DATA: Row[] = [
  {
    id: 'TASK-1',
    title: 'Fix login bug',
    status: 'todo',
    priority: 'high',
    count: 3,
  },
  {
    id: 'TASK-2',
    title: 'Write docs',
    status: 'done',
    priority: 'low',
    count: 1,
  },
  {
    id: 'TASK-3',
    title: 'Fix logout bug',
    status: 'todo',
    priority: 'medium',
    count: 2,
  },
  {
    id: 'TASK-4',
    title: 'Refactor table',
    status: 'in-progress',
    priority: 'high',
    count: 5,
  },
  {
    id: 'TASK-5',
    title: 'Update deps',
    status: 'done',
    priority: 'medium',
    count: 4,
  },
]

function createEngine(): TableEngine<Row> {
  return new TableEngine<Row>({ data: DATA, columns: COLUMNS })
}

describe('TableEngine', () => {
  it('exposes all rows on the first page by default', () => {
    const engine = createEngine()
    expect(engine.rows().map((r) => r.id)).toEqual([
      'TASK-1',
      'TASK-2',
      'TASK-3',
      'TASK-4',
      'TASK-5',
    ])
    expect(engine.pageCount()).toBe(1)
    expect(engine.isFiltered()).toBe(false)
  })

  it('sorts ascending and descending via setSorting', () => {
    const engine = createEngine()
    engine.setSorting([{ column: 'title', direction: 'asc' }])
    expect(engine.rows().map((r) => r.title)).toEqual([
      'Fix login bug',
      'Fix logout bug',
      'Refactor table',
      'Update deps',
      'Write docs',
    ])
    engine.setSorting([{ column: 'title', direction: 'desc' }])
    expect(engine.rows().map((r) => r.title)).toEqual([
      'Write docs',
      'Update deps',
      'Refactor table',
      'Fix logout bug',
      'Fix login bug',
    ])
  })

  it('sorts numbers numerically, not lexicographically', () => {
    const engine = createEngine()
    engine.setSorting([{ column: 'count', direction: 'asc' }])
    expect(engine.rows().map((r) => r.count)).toEqual([1, 2, 3, 4, 5])
    engine.setSorting([{ column: 'count', direction: 'desc' }])
    expect(engine.rows().map((r) => r.count)).toEqual([5, 4, 3, 2, 1])
  })

  it('cycles sorting none -> asc -> desc -> none', () => {
    const engine = createEngine()
    engine.toggleSorting('title')
    expect(engine.getSort('title')).toBe('asc')
    engine.toggleSorting('title')
    expect(engine.getSort('title')).toBe('desc')
    engine.toggleSorting('title')
    expect(engine.getSort('title')).toBeNull()
    expect(engine.state().sorting).toEqual([])
  })

  it('ignores sorting for columns with enableSorting: false', () => {
    const engine = new TableEngine<Row>({
      data: DATA,
      columns: COLUMNS.map((c) =>
        c.id === 'title' ? { ...c, enableSorting: false } : c
      ),
    })
    engine.toggleSorting('title')
    expect(engine.getSort('title')).toBeNull()
  })

  it('filters globally across all cell values (case-insensitive)', () => {
    const engine = createEngine()
    engine.setGlobalFilter('fix')
    expect(engine.rows().map((r) => r.id)).toEqual(['TASK-1', 'TASK-3'])
    expect(engine.isFiltered()).toBe(true)
    engine.setGlobalFilter('TASK-2')
    expect(engine.rows().map((r) => r.id)).toEqual(['TASK-2'])
  })

  it('supports a custom globalFilterFn override (id/title only)', () => {
    const engine = new TableEngine<Row>({
      data: DATA,
      columns: COLUMNS,
      globalFilterFn: (row, filter) => {
        const needle = filter.toLowerCase()
        return (
          row.id.toLowerCase().includes(needle) ||
          row.title.toLowerCase().includes(needle)
        )
      },
    })
    engine.setGlobalFilter('done')
    // 'done' only appears in the status column, which the override ignores
    expect(engine.rows()).toEqual([])
    engine.setGlobalFilter('docs')
    expect(engine.rows().map((r) => r.id)).toEqual(['TASK-2'])
  })

  it('applies multi-value column filters', () => {
    const engine = createEngine()
    engine.setColumnFilter('status', ['todo', 'done'])
    expect(engine.rows().map((r) => r.id)).toEqual([
      'TASK-1',
      'TASK-2',
      'TASK-3',
      'TASK-5',
    ])
    engine.setColumnFilter('priority', ['high'])
    expect(engine.rows().map((r) => r.id)).toEqual(['TASK-1'])
    expect(engine.getColumnFilter('status')).toEqual(['todo', 'done'])
  })

  it('removes a column filter when set to an empty array', () => {
    const engine = createEngine()
    engine.setColumnFilter('status', ['todo'])
    engine.setColumnFilter('status', [])
    expect(engine.state().columnFilters).toEqual([])
    expect(engine.rows()).toHaveLength(5)
  })

  it("matches 'contains' column filters as case-insensitive substrings", () => {
    const engine = new TableEngine<Row>({
      data: DATA,
      columns: COLUMNS.map((column) =>
        column.id === 'title'
          ? { ...column, filterMode: 'contains' as const }
          : column
      ),
    })
    engine.setColumnFilter('title', ['fix'])
    expect(engine.rows().map((r) => r.id)).toEqual(['TASK-1', 'TASK-3'])
    engine.setColumnFilter('title', ['FIX'])
    expect(engine.rows().map((r) => r.id)).toEqual(['TASK-1', 'TASK-3'])
    engine.setColumnFilter('title', [''])
    expect(engine.rows()).toHaveLength(5)
  })

  it("keeps 'exact' column filters on full-value membership", () => {
    const engine = createEngine()
    engine.setColumnFilter('title', ['fix'])
    expect(engine.rows()).toEqual([])
    engine.setColumnFilter('title', ['Fix login bug'])
    expect(engine.rows().map((r) => r.id)).toEqual(['TASK-1'])
  })

  it('combines global filter, column filter and sorting', () => {
    const engine = createEngine()
    engine.setGlobalFilter('fix')
    engine.setColumnFilter('status', ['todo'])
    engine.setSorting([{ column: 'title', direction: 'desc' }])
    expect(engine.rows().map((r) => r.id)).toEqual(['TASK-3', 'TASK-1'])
  })

  it('paginates and clamps the page index', () => {
    const engine = createEngine()
    engine.setPageSize(2)
    expect(engine.pageCount()).toBe(3)
    expect(engine.rows().map((r) => r.id)).toEqual(['TASK-1', 'TASK-2'])
    engine.setPageIndex(2)
    expect(engine.rows().map((r) => r.id)).toEqual(['TASK-5'])
    engine.setPageIndex(99)
    expect(engine.state().pagination.pageIndex).toBe(2)
    engine.setPageIndex(-5)
    expect(engine.state().pagination.pageIndex).toBe(0)
  })

  it('resets to the first page when filters change', () => {
    const engine = createEngine()
    engine.setPageSize(2)
    engine.setPageIndex(2)
    engine.setGlobalFilter('fix')
    expect(engine.state().pagination.pageIndex).toBe(0)
    expect(engine.rows().map((r) => r.id)).toEqual(['TASK-1', 'TASK-3'])
  })

  it('clamps the page index when the page size grows', () => {
    const engine = createEngine()
    engine.setPageSize(2)
    engine.setPageIndex(2)
    engine.setPageSize(10)
    expect(engine.state().pagination.pageIndex).toBe(0)
  })

  it('tracks single row selection', () => {
    const engine = createEngine()
    engine.toggleRowSelection('TASK-1', true)
    expect(engine.selectedRows().map((r) => r.id)).toEqual(['TASK-1'])
    expect(engine.allRowSelection()).toBe(false)
    expect(engine.someRowSelection()).toBe(true)
    engine.toggleRowSelection('TASK-1', false)
    expect(engine.selectedRows()).toEqual([])
    expect(engine.someRowSelection()).toBe(false)
  })

  it('removes the row-selection key on deselect instead of storing false', () => {
    const engine = createEngine()
    engine.toggleRowSelection('TASK-1', true)
    expect(engine.state().rowSelection).toHaveProperty('TASK-1')
    engine.toggleRowSelection('TASK-1', false)
    expect(engine.state().rowSelection).not.toHaveProperty('TASK-1')
    expect(engine.state().rowSelection).toEqual({})
  })

  it('selects all / some / clears selection', () => {
    const engine = createEngine()
    expect(engine.allRowSelection()).toBe(false)
    engine.toggleAllRows()
    expect(engine.allRowSelection()).toBe(true)
    expect(engine.someRowSelection()).toBe(false)
    expect(engine.selectedRows()).toHaveLength(5)
    engine.toggleRowSelection('TASK-1', false)
    expect(engine.allRowSelection()).toBe(false)
    expect(engine.someRowSelection()).toBe(true)
    engine.resetRowSelection()
    expect(engine.selectedRows()).toEqual([])
    expect(engine.state().rowSelection).toEqual({})
  })

  it('selects only filtered rows with setAllRowsSelected', () => {
    const engine = createEngine()
    engine.setGlobalFilter('fix')
    engine.setAllRowsSelected(true)
    expect(engine.selectedRows().map((r) => r.id)).toEqual(['TASK-1', 'TASK-3'])
    expect(engine.allRowSelection()).toBe(true)
  })

  it('computes facet counts excluding the column’s own filter', () => {
    const engine = createEngine()
    engine.setColumnFilter('status', ['todo'])
    const facets = engine.facetValues('status')
    expect(facets).toEqual([
      { value: 'done', count: 2 },
      { value: 'todo', count: 2 },
      { value: 'in-progress', count: 1 },
    ])
  })

  it('computes facet counts honoring other column filters', () => {
    const engine = createEngine()
    engine.setColumnFilter('priority', ['high'])
    expect(engine.facetValues('status')).toEqual([
      { value: 'in-progress', count: 1 },
      { value: 'todo', count: 1 },
    ])
  })

  it('hides columns via visibility state', () => {
    const engine = createEngine()
    expect(engine.visibleColumns().map((c) => c.id)).toHaveLength(5)
    engine.setColumnVisibility('priority', false)
    expect(engine.visibleColumns().map((c) => c.id)).not.toContain('priority')
    expect(engine.isColumnVisible('priority')).toBe(false)
    engine.toggleColumnVisibility('priority')
    expect(engine.isColumnVisible('priority')).toBe(true)
  })

  it('reads cell values via accessorFn and renders via cell', () => {
    const engine = new TableEngine<Row>({
      data: DATA,
      columns: [
        {
          id: 'upper',
          header: 'Upper',
          accessorFn: (row) => row.title.toUpperCase(),
          cell: (row) => `!${row.title}!`,
        },
      ],
    })
    expect(engine.getCellValue(DATA[0], 'upper')).toBe('FIX LOGIN BUG')
    expect(engine.getDisplayValue(DATA[0], engine.columns()[0])).toBe(
      '!Fix login bug!'
    )
  })

  it('merges partial state via applyPartialState', () => {
    const engine = createEngine()
    engine.applyPartialState({
      globalFilter: 'docs',
      columnFilters: [{ id: 'status', value: ['done'] }],
      pagination: { pageIndex: 0, pageSize: 20 },
    })
    expect(engine.rows().map((r) => r.id)).toEqual(['TASK-2'])
    expect(engine.state().pagination.pageSize).toBe(20)
  })

  describe('clampPageIndex', () => {
    function createBigEngine(): TableEngine<Row> {
      const data: Row[] = Array.from({ length: 30 }, (_, i) => ({
        id: `TASK-${i + 1}`,
        title: `Task ${i + 1}`,
        status: i % 2 === 0 ? 'todo' : 'done',
        priority: 'medium',
        count: i,
      }))
      return new TableEngine<Row>({ data, columns: COLUMNS })
    }

    it('clamps an out-of-range pageIndex on applyPartialState (deep link ?page=99)', () => {
      const engine = createBigEngine()
      engine.applyPartialState({ pagination: { pageIndex: 98, pageSize: 10 } })
      expect(engine.pageCount()).toBe(3)
      expect(engine.state().pagination.pageIndex).toBe(2)
      expect(engine.rows().map((r) => r.id)).toEqual([
        'TASK-21',
        'TASK-22',
        'TASK-23',
        'TASK-24',
        'TASK-25',
        'TASK-26',
        'TASK-27',
        'TASK-28',
        'TASK-29',
        'TASK-30',
      ])
    })

    it('clamps constructor initialState with an out-of-range page', () => {
      const engine = new TableEngine<Row>({
        data: Array.from({ length: 30 }, (_, i) => ({
          id: `TASK-${i + 1}`,
          title: `Task ${i + 1}`,
          status: 'todo',
          priority: 'medium',
          count: i,
        })),
        columns: COLUMNS,
        initialState: { pagination: { pageIndex: 98, pageSize: 10 } },
      })
      expect(engine.state().pagination.pageIndex).toBe(2)
    })

    it('clamps the page when data shrinks below the current page', () => {
      const engine = createBigEngine()
      engine.setPageIndex(2)
      expect(engine.state().pagination.pageIndex).toBe(2)
      engine.setData(engine.data().slice(0, 5))
      expect(engine.pageCount()).toBe(1)
      expect(engine.state().pagination.pageIndex).toBe(0)
    })

    it('resets to the first page when a filter shrinks the page count', () => {
      const engine = createBigEngine()
      engine.setPageIndex(2)
      engine.setGlobalFilter('Task 1')
      expect(engine.state().pagination.pageIndex).toBe(0)
      expect(engine.pageCount()).toBeGreaterThan(0)
    })

    it('is a no-op while the page stays in range', () => {
      const engine = createBigEngine()
      engine.setPageIndex(1)
      engine.clampPageIndex()
      expect(engine.state().pagination.pageIndex).toBe(1)
    })
  })
})
