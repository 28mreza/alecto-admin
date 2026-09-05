import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { vi } from 'vitest'
import { TasksMutateDrawerComponent } from './tasks-mutate-drawer.component'
import { TasksStoreService } from '../store/tasks-store.service'

describe('TasksMutateDrawerComponent', () => {
  let fixture: ComponentFixture<TasksMutateDrawerComponent>
  let store: TasksStoreService

  beforeEach(async () => {
    document.body.innerHTML = ''
    await TestBed.configureTestingModule({
      imports: [TasksMutateDrawerComponent],
      providers: [TasksStoreService],
    }).compileComponents()
    store = TestBed.inject(TasksStoreService)
    fixture = TestBed.createComponent(TasksMutateDrawerComponent)
    fixture.componentRef.setInput('open', true)
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  function sheetForm(): HTMLFormElement | null {
    return document.body.querySelector('form#tasks-form')
  }

  it('renders the create title and fields when the sheet opens', () => {
    const content = document.body.querySelector('hlm-sheet-content')
    expect(content?.textContent).toContain('Create Task')
    expect(sheetForm()).not.toBeNull()
    expect(
      sheetForm()?.querySelector('input[formcontrolname="title"]')
    ).not.toBeNull()
  })

  it('renders an hlm-radio-indicator inside every radio', () => {
    const indicators = document.body.querySelectorAll(
      'hlm-radio hlm-radio-indicator'
    )
    expect(indicators.length).toBe(6)
  })

  it('blocks an empty submit: no task added, validation shown', () => {
    const closed = vi.fn()
    fixture.componentInstance.closed.subscribe(closed)

    sheetForm()?.dispatchEvent(new Event('submit'))
    fixture.detectChanges()

    expect(store.tasks()).toHaveLength(100)
    expect(closed).not.toHaveBeenCalled()
    expect(document.body.textContent).toContain('Title is required.')
  })

  it('creates a task on valid submit and closes the sheet', () => {
    const closed = vi.fn()
    fixture.componentInstance.closed.subscribe(closed)

    fixture.componentInstance.form.setValue({
      title: 'Brand new task',
      status: 'todo',
      label: 'feature',
      priority: 'high',
    })
    sheetForm()?.dispatchEvent(new Event('submit'))
    fixture.detectChanges()

    expect(store.tasks()).toHaveLength(101)
    expect(store.tasks()[0]).toMatchObject({ title: 'Brand new task' })
    expect(closed).toHaveBeenCalledTimes(1)
  })

  it('updates the current row in update mode', () => {
    const row = store.tasks()[0]
    fixture.componentRef.setInput('currentRow', row)
    fixture.detectChanges()

    expect(document.body.textContent).toContain('Update Task')

    fixture.componentInstance.form.setValue({
      title: 'Renamed task',
      status: 'done',
      label: 'bug',
      priority: 'low',
    })
    sheetForm()?.dispatchEvent(new Event('submit'))
    fixture.detectChanges()

    expect(store.tasks()).toHaveLength(100)
    expect(store.tasks().find((task) => task.id === row.id)).toMatchObject({
      title: 'Renamed task',
      status: 'done',
    })
  })
})
