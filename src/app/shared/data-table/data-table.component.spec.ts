import { Component } from '@angular/core'
import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { provideRouter, Router } from '@angular/router'
import { vi } from 'vitest'
import { ensureResizeObserverStub } from '../../../test-helpers'
import { DataTableComponent } from './data-table.component'
import { type TableColumn } from './table-engine'

interface TestRow {
  id: string
  title: string
  status: string
}

const COLUMNS: TableColumn<TestRow>[] = [
  { id: 'id', header: 'ID' },
  {
    id: 'title',
    header: 'Title',
    meta: {
      className: 'col-title',
      thClassName: 'th-title',
      tdClassName: 'td-title',
    },
  },
  { id: 'status', header: 'Status' },
]

const DATA: TestRow[] = [
  { id: 'TASK-1', title: 'Fix login bug', status: 'todo' },
  { id: 'TASK-2', title: 'Write docs', status: 'done' },
  { id: 'TASK-3', title: 'Fix logout bug', status: 'todo' },
]

@Component({
  standalone: true,
  imports: [DataTableComponent],
  template: `
    <app-data-table
      [columns]="columns"
      [data]="data"
      searchPlaceholder="Filter rows..."
      [filterConfigs]="filterConfigs"
      tableClass="min-w-xl"
      selectionCellClass="inset-s-0 z-10 rounded-tl-[inherit] max-md:sticky"
    />
  `,
})
class HostComponent {
  readonly columns = COLUMNS
  readonly data = DATA
  readonly filterConfigs = [
    {
      columnId: 'status',
      title: 'Status',
      options: [
        { label: 'Todo', value: 'todo' },
        { label: 'Done', value: 'done' },
      ],
    },
  ]
}

describe('DataTableComponent', () => {
  let fixture: ComponentFixture<HostComponent>

  beforeEach(async () => {
    ensureResizeObserverStub()
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(HostComponent)
    fixture.detectChanges()
  })

  function bodyRows(): HTMLTableRowElement[] {
    return [
      ...fixture.nativeElement.querySelectorAll('tbody tr'),
    ] as HTMLTableRowElement[]
  }

  it('renders headers, rows and the empty-state-free table', () => {
    const headers = [...fixture.nativeElement.querySelectorAll('thead th')].map(
      (th: Element) => th.textContent?.trim()
    )
    expect(headers.join(' ')).toContain('ID')
    expect(headers.join(' ')).toContain('Title')
    expect(headers.join(' ')).toContain('Status')
    expect(bodyRows()).toHaveLength(3)
  })

  it('shows pagination info and selection state', () => {
    const text: string = fixture.nativeElement.textContent ?? ''
    expect(text).toContain('total items')
    expect(text).toContain('Rows per page')
    const nav = fixture.nativeElement.querySelector(
      'nav[aria-label="Table pagination"]'
    )
    expect(nav).not.toBeNull()
    const activeLink = fixture.nativeElement.querySelector(
      '[hlmPaginationLink][data-active="true"]'
    ) as HTMLElement | null
    expect(activeLink?.textContent?.trim()).toBe('1')
  })

  it('filters rows through the search input', () => {
    const search = fixture.nativeElement.querySelector(
      'input[aria-label="Search"]'
    ) as HTMLInputElement
    expect(search).not.toBeNull()
    search.value = 'docs'
    search.dispatchEvent(new Event('input'))
    fixture.detectChanges()
    expect(bodyRows()).toHaveLength(1)
    expect(bodyRows()[0].textContent).toContain('Write docs')
    const text: string = fixture.nativeElement.textContent ?? ''
    expect(text).toContain('Reset')
  })

  it('shows the empty state when nothing matches', () => {
    const search = fixture.nativeElement.querySelector(
      'input[aria-label="Search"]'
    ) as HTMLInputElement
    search.value = 'no-such-row'
    search.dispatchEvent(new Event('input'))
    fixture.detectChanges()
    expect(bodyRows()).toHaveLength(1)
    expect(bodyRows()[0].textContent).toContain('No results.')
  })

  it('marks selected rows with data-state="selected" and shows bulk actions', () => {
    const table = fixture.debugElement.query(By.directive(DataTableComponent))
    const instance = table.componentInstance as DataTableComponent<TestRow>
    instance.engine.toggleRowSelection('TASK-1', true)
    fixture.detectChanges()
    const selected = fixture.nativeElement.querySelector(
      'tbody tr[data-state="selected"]'
    ) as HTMLTableRowElement | null
    expect(selected).not.toBeNull()
    expect(selected?.textContent).toContain('Fix login bug')
    const text: string = fixture.nativeElement.textContent ?? ''
    expect(text).toContain('1 row selected')
  })

  it('merges meta.className with th/td-specific classes', () => {
    const th = fixture.nativeElement.querySelector(
      'thead th.col-title.th-title'
    ) as HTMLTableCellElement | null
    expect(th).not.toBeNull()
    expect(th?.textContent).toContain('Title')
    const cells = [
      ...fixture.nativeElement.querySelectorAll('tbody td.col-title.td-title'),
    ] as HTMLTableCellElement[]
    expect(cells.length).toBe(3)
    expect(cells[0].textContent).toContain('Fix login bug')
  })

  it('keeps the mobile bulk-actions margin on the wrapper', () => {
    const wrapper = fixture.nativeElement.querySelector(
      'app-data-table > div'
    ) as HTMLElement | null
    expect(wrapper).not.toBeNull()
    expect(
      wrapper?.className.includes('max-sm:has-[div[role=toolbar]]:mb-16')
    ).toBe(true)
  })

  it('applies tableClass to the table and selectionCellClass to selection cells', () => {
    const table = fixture.nativeElement.querySelector(
      'table'
    ) as HTMLTableElement | null
    expect(table?.className.includes('min-w-xl')).toBe(true)
    const selectTh = fixture.nativeElement.querySelector(
      'thead th.max-md\\:sticky'
    ) as HTMLTableCellElement | null
    expect(selectTh).not.toBeNull()
    const selectTds = [
      ...fixture.nativeElement.querySelectorAll('tbody td.max-md\\:sticky'),
    ] as HTMLTableCellElement[]
    expect(selectTds.length).toBe(3)
  })
})

@Component({
  standalone: true,
  imports: [DataTableComponent],
  template: `
    <app-data-table
      [columns]="columns"
      [data]="data"
      [urlSync]="true"
      searchPlaceholder="Filter rows..."
      searchKey="title"
    />
  `,
})
class SearchKeyHostComponent {
  readonly columns: TableColumn<TestRow>[] = [
    { id: 'id', header: 'ID' },
    { id: 'title', header: 'Title', filterMode: 'contains' },
    { id: 'status', header: 'Status' },
  ]
  readonly data = DATA
}

describe('DataTableComponent searchKey', () => {
  let fixture: ComponentFixture<SearchKeyHostComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchKeyHostComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(SearchKeyHostComponent)
    fixture.detectChanges()
  })

  function bodyRows(): HTMLTableRowElement[] {
    return [
      ...fixture.nativeElement.querySelectorAll('tbody tr'),
    ] as HTMLTableRowElement[]
  }

  function searchInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector(
      'input[aria-label="Search"]'
    ) as HTMLInputElement
  }

  function table(): DataTableComponent<TestRow> {
    return fixture.debugElement.query(By.directive(DataTableComponent))
      .componentInstance as DataTableComponent<TestRow>
  }

  it('scopes the search box to the column: other columns do not match', () => {
    searchInput().value = 'todo'
    searchInput().dispatchEvent(new Event('input'))
    fixture.detectChanges()
    // 'todo' only appears in the status column → no rows match the title
    expect(bodyRows()).toHaveLength(1)
    expect(bodyRows()[0].textContent).toContain('No results.')
    expect(table().engine.state().globalFilter).toBe('')
    expect(table().engine.getColumnFilter('title')).toEqual(['todo'])
  })

  it('matches the scoped column as a substring and syncs the column URL key', async () => {
    searchInput().value = 'fix'
    searchInput().dispatchEvent(new Event('input'))
    fixture.detectChanges()
    await fixture.whenStable()

    expect(bodyRows()).toHaveLength(2)
    const url = TestBed.inject(Router).url
    expect(url).toContain('title=fix')
    expect(url).not.toContain('filter=')
  })

  it('removes the column URL key when the search is cleared', async () => {
    searchInput().value = 'fix'
    searchInput().dispatchEvent(new Event('input'))
    fixture.detectChanges()
    await fixture.whenStable()
    expect(bodyRows()).toHaveLength(2)
    expect(TestBed.inject(Router).url).toContain('title=fix')

    searchInput().value = ''
    searchInput().dispatchEvent(new Event('input'))
    fixture.detectChanges()
    await fixture.whenStable()
    expect(bodyRows()).toHaveLength(3)
    expect(TestBed.inject(Router).url).not.toContain('title')
  })
})
@Component({
  standalone: true,
  imports: [DataTableComponent],
  template: `
    <app-data-table [columns]="columns" [data]="data" [urlSync]="true" />
  `,
})
class UrlHostComponent {
  readonly columns: TableColumn<TestRow>[] = [
    { id: 'id', header: 'ID' },
    { id: 'title', header: 'Title' },
  ]
  readonly data: TestRow[] = Array.from({ length: 25 }, (_, i) => ({
    id: `R-${i + 1}`,
    title: `Row ${i + 1}`,
    status: 'todo',
  }))
}

describe('DataTableComponent urlSync', () => {
  let fixture: ComponentFixture<UrlHostComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrlHostComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(UrlHostComponent)
    fixture.detectChanges()
  })

  it('clamps a deep-linked out-of-range page in state and rewrites the URL', () => {
    const router = TestBed.inject(Router)
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true)
    const table = fixture.debugElement.query(By.directive(DataTableComponent))
    const instance = table.componentInstance as DataTableComponent<TestRow>

    instance.engine.applyPartialState({
      pagination: { pageIndex: 98, pageSize: 10 },
    })
    expect(instance.engine.state().pagination.pageIndex).toBe(2)
    fixture.detectChanges()

    expect(navigateSpy).toHaveBeenCalled()
    const extras = navigateSpy.mock.calls[0][1] as
      { queryParams?: Record<string, unknown> } | undefined
    expect(extras?.queryParams?.['page']).toBe(3)
  })
})
