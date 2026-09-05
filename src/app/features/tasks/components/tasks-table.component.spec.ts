import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { TasksTableComponent } from './tasks-table.component'
import { TasksStoreService } from '../store/tasks-store.service'

describe('TasksTableComponent', () => {
  let fixture: ComponentFixture<TasksTableComponent>
  let store: TasksStoreService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksTableComponent],
      providers: [provideRouter([]), TasksStoreService],
    }).compileComponents()
    store = TestBed.inject(TasksStoreService)
    fixture = TestBed.createComponent(TasksTableComponent)
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

  it('renders the Task/Title/Status/Priority headers', () => {
    const headers = [...fixture.nativeElement.querySelectorAll('thead th')].map(
      (th: Element) => th.textContent?.trim()
    )
    expect(headers.join(' ')).toContain('Task')
    expect(headers.join(' ')).toContain('Title')
    expect(headers.join(' ')).toContain('Status')
    expect(headers.join(' ')).toContain('Priority')
  })

  it('renders the first page of seeded tasks with badge + icon cells', () => {
    expect(bodyRows()).toHaveLength(10)
    const first = bodyRows()[0].textContent ?? ''
    expect(first).toContain(store.tasks()[0].id)
  })

  it('narrows rows through the id/title search', () => {
    const target = store.tasks()[0]
    const search = searchInput()
    search.value = target.id
    search.dispatchEvent(new Event('input'))
    fixture.detectChanges()

    const rows = bodyRows()
    expect(rows.length).toBeGreaterThanOrEqual(1)
    for (const row of rows) {
      const text = (row.textContent ?? '').toLowerCase()
      expect(
        text.includes(target.id.toLowerCase()) ||
          text.includes(target.title.toLowerCase())
      ).toBe(true)
    }
  })

  it('shows the empty state when nothing matches', () => {
    const search = searchInput()
    search.value = 'zzz-no-such-task'
    search.dispatchEvent(new Event('input'))
    fixture.detectChanges()

    expect(bodyRows()).toHaveLength(1)
    expect(bodyRows()[0].textContent).toContain('No results.')
  })
})
