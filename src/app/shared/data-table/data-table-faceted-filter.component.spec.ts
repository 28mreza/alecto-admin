import { Component, signal } from '@angular/core'
import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideIcons } from '@ng-icons/core'
import { lucideCheck } from '@ng-icons/lucide'
import {
  DataTableFacetedFilterComponent,
  type FacetOption,
} from './data-table-faceted-filter.component'
import { TableEngine, type TableColumn } from './table-engine'

interface TestRow {
  id: string
  status: string
}

const COLUMNS: TableColumn<TestRow>[] = [
  { id: 'id', header: 'ID' },
  { id: 'status', header: 'Status' },
]

const DATA: TestRow[] = [
  { id: 'TASK-1', status: 'todo' },
  { id: 'TASK-2', status: 'done' },
]

@Component({
  standalone: true,
  imports: [DataTableFacetedFilterComponent],
  providers: [provideIcons({ lucideCheck })],
  template: `
    <app-data-table-faceted-filter
      [engine]="engine"
      columnId="status"
      title="Status"
      [options]="options()"
    />
  `,
})
class FacetHostComponent {
  readonly engine = new TableEngine<TestRow>({ data: DATA, columns: COLUMNS })
  readonly options = signal<FacetOption[]>([
    { label: 'Todo', value: 'todo', icon: 'lucideCheck' },
    { label: 'Done', value: 'done' },
  ])

  constructor() {
    this.engine.setColumnFilter('status', ['todo'])
  }
}

describe('DataTableFacetedFilterComponent', () => {
  let fixture: ComponentFixture<FacetHostComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacetHostComponent],
    }).compileComponents()
    fixture = TestBed.createComponent(FacetHostComponent)
    fixture.detectChanges()
  })

  function detailBadges(): Element[] {
    return [
      ...fixture.nativeElement.querySelectorAll(
        '.space-x-1 [data-slot="badge"]'
      ),
    ] as Element[]
  }

  function badgeIcons(): Element[] {
    return [
      ...fixture.nativeElement.querySelectorAll(
        '.space-x-1 [data-slot="badge"] ng-icon'
      ),
    ] as Element[]
  }

  it('renders the option icon inside the selected-value badge', () => {
    const badges = detailBadges()
    expect(badges.length).toBe(1)
    expect(badges[0].textContent).toContain('Todo')
    expect(badgeIcons().length).toBe(1)
  })

  it('renders badges without icons when the option omits icon', () => {
    fixture.componentInstance.options.set([
      { label: 'Todo', value: 'todo' },
      { label: 'Done', value: 'done' },
    ])
    fixture.detectChanges()
    expect(detailBadges().length).toBe(1)
    expect(detailBadges()[0].textContent).toContain('Todo')
    expect(badgeIcons().length).toBe(0)
  })
})
