import { OverlayContainer } from '@angular/cdk/overlay'
import { Component, signal } from '@angular/core'
import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { DataTableColumnHeaderComponent } from './data-table-column-header.component'
import { TableEngine, type TableColumn } from './table-engine'

interface TestRow {
  id: string
  title: string
  status: string
}

const COLUMNS: TableColumn<TestRow>[] = [
  { id: 'title', header: 'Title' },
  { id: 'status', header: 'Status', enableHiding: false },
  { id: 'id', header: 'ID', enableSorting: false, enableHiding: false },
]

@Component({
  standalone: true,
  imports: [DataTableColumnHeaderComponent],
  template: `
    <app-data-table-column-header
      [engine]="engine"
      [columnId]="columnId()"
      [title]="title()"
    />
  `,
})
class HostComponent {
  readonly engine = new TableEngine<TestRow>({
    data: [{ id: 'TASK-1', title: 'B', status: 'todo' }],
    columns: COLUMNS,
  })
  readonly columnId = signal('title')
  readonly title = signal('Title')
}

describe('DataTableColumnHeaderComponent', () => {
  let fixture: ComponentFixture<HostComponent>
  let overlay: HTMLElement

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(HostComponent)
    overlay = TestBed.inject(OverlayContainer).getContainerElement()
    fixture.detectChanges()
  })

  function header(): HTMLElement {
    return fixture.nativeElement as HTMLElement
  }

  async function openMenu(label = 'Sort by Title'): Promise<HTMLElement[]> {
    const trigger = header().querySelector(
      `button[aria-label="${label}"]`
    ) as HTMLButtonElement
    trigger.click()
    fixture.detectChanges()
    await fixture.whenStable()
    // The overlay menu items render on a later macrotask.
    await new Promise((resolve) => setTimeout(resolve, 50))
    fixture.detectChanges()
    return [
      ...overlay.querySelectorAll<HTMLButtonElement>(
        'button[data-slot="dropdown-menu-item"]'
      ),
    ]
  }

  it('renders the title button with the unsorted icon', () => {
    expect(header().textContent).toContain('Title')
  })

  it('opens Asc/Desc/Hide items and sorts on Asc', async () => {
    const menuItems = await openMenu()
    const items = menuItems.map((el) => el.textContent?.trim())
    expect(items).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Asc'),
        expect.stringContaining('Desc'),
        expect.stringContaining('Hide'),
      ])
    )
    const host = fixture.componentInstance
    const asc = menuItems.find((el) => el.textContent?.includes('Asc'))!
    asc.click()
    fixture.detectChanges()
    expect(host.engine.getSort('title')).toBe('asc')
  })

  it('hides the column via the Hide item', async () => {
    const host = fixture.componentInstance
    const hide = (await openMenu()).find((el) =>
      el.textContent?.includes('Hide')
    )!
    hide.click()
    fixture.detectChanges()
    expect(host.engine.isColumnVisible('title')).toBe(false)
  })

  it('omits the Hide item when the column cannot hide', async () => {
    fixture.componentInstance.columnId.set('status')
    fixture.componentInstance.title.set('Status')
    fixture.detectChanges()
    const items = (await openMenu('Sort by Status')).map((el) =>
      el.textContent?.trim()
    )
    expect(items.some((t) => t?.includes('Asc'))).toBe(true)
    expect(items.some((t) => t?.includes('Hide'))).toBe(false)
  })
})
