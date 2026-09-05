import { TestBed } from '@angular/core/testing'
import { TasksStoreService } from './tasks-store.service'

describe('TasksStoreService', () => {
  let store: TasksStoreService

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [TasksStoreService] })
    store = TestBed.inject(TasksStoreService)
  })

  it('starts with the 100 seeded tasks and no open dialog', () => {
    expect(store.tasks()).toHaveLength(100)
    expect(store.open()).toBeNull()
    expect(store.currentRow()).toBeNull()
  })

  it('toggles dialog state: same value closes, different value switches', () => {
    store.setOpen('create')
    expect(store.open()).toBe('create')

    store.setOpen('create')
    expect(store.open()).toBeNull()

    store.setOpen('update')
    expect(store.open()).toBe('update')
    store.setOpen('delete')
    expect(store.open()).toBe('delete')
    store.setOpen(null)
    expect(store.open()).toBeNull()
  })

  it('tracks the current row', () => {
    const row = store.tasks()[0]
    store.setCurrentRow(row)
    expect(store.currentRow()).toEqual(row)
    store.setCurrentRow(null)
    expect(store.currentRow()).toBeNull()
  })

  it('addTask prepends a task with a generated TASK-XXXX id', () => {
    const before = store.tasks().length
    const created = store.addTask({
      title: 'New task',
      status: 'todo',
      label: 'feature',
      priority: 'high',
    })
    expect(created.id).toMatch(/^TASK-\d{4}$/)
    expect(store.tasks()).toHaveLength(before + 1)
    expect(store.tasks()[0]).toEqual(created)
  })

  it('addTask generates unique ids across 100 sequential adds', () => {
    const preExisting = new Set(store.tasks().map((task) => task.id))
    const ids = new Set<string>()
    for (let i = 0; i < 100; i++) {
      const created = store.addTask({
        title: `Task ${i}`,
        status: 'todo',
        label: 'feature',
        priority: 'high',
      })
      ids.add(created.id)
    }
    // Every generated id is distinct and collides with neither the seeded
    // ids (which may themselves contain a duplicate pair) nor its siblings.
    expect(ids.size).toBe(100)
    for (const id of ids) {
      expect(preExisting.has(id)).toBe(false)
    }
  })

  it('updateTask patches title/status/label/priority by id', () => {
    const target = store.tasks()[0]
    store.updateTask(target.id, {
      title: 'Renamed',
      status: 'done',
      label: 'bug',
      priority: 'low',
    })
    const updated = store.tasks().find((task) => task.id === target.id)
    expect(updated).toMatchObject({
      title: 'Renamed',
      status: 'done',
      label: 'bug',
      priority: 'low',
    })
  })

  it('updateTask keeps the current row in sync', () => {
    const target = store.tasks()[0]
    store.setCurrentRow(target)
    store.updateTask(target.id, { status: 'done' })
    expect(store.currentRow()?.status).toBe('done')
  })

  it('deleteTask removes the task and clears a matching current row', () => {
    const target = store.tasks()[0]
    store.setCurrentRow(target)
    store.deleteTask(target.id)
    expect(store.tasks()).toHaveLength(99)
    expect(store.tasks().some((task) => task.id === target.id)).toBe(false)
    expect(store.currentRow()).toBeNull()
  })

  it('deleteMany removes every selected task', () => {
    const ids = store
      .tasks()
      .slice(0, 3)
      .map((task) => task.id)
    store.deleteMany(ids)
    expect(store.tasks()).toHaveLength(97)
    for (const id of ids) {
      expect(store.tasks().some((task) => task.id === id)).toBe(false)
    }
  })

  it('setLabel updates the task label (functional Labels submenu)', () => {
    const target = store.tasks().find((task) => task.label !== 'bug')!
    store.setLabel(target.id, 'bug')
    expect(store.tasks().find((task) => task.id === target.id)?.label).toBe(
      'bug'
    )
  })
})
