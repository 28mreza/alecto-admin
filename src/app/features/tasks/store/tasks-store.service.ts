import { Injectable, signal } from '@angular/core'
import type { Task, TaskLabel, TaskPriority, TaskStatus } from '../data/schema'
import { tasks as seedTasks } from '../data/tasks'

/** Which dialog the tasks page has open (`null` = none). */
export type TasksDialog = 'create' | 'update' | 'delete' | 'import'

function randomTaskId(): string {
  return `TASK-${Math.floor(1000 + Math.random() * 9000)}`
}

/**
 * Page-scoped tasks state.
 *
 * Mirrors `tasks-provider.tsx` (dialog state with toggle semantics +
 * `currentRow`) plus the row mutations the dialogs and row/bulk actions
 * need. Deliberately NOT `providedIn: 'root'` — `TasksComponent` provides it
 * so each visit to `/tasks` starts from the seeded list.
 */
@Injectable()
export class TasksStoreService {
  private readonly _tasks = signal<Task[]>([...seedTasks])
  private readonly _open = signal<TasksDialog | null>(null)
  private readonly _currentRow = signal<Task | null>(null)

  readonly tasks = this._tasks.asReadonly()
  readonly open = this._open.asReadonly()
  readonly currentRow = this._currentRow.asReadonly()

  /**
   * Toggle semantics matching the source `useDialogState`: opening the
   * already-open dialog closes it again.
   */
  setOpen(dialog: TasksDialog | null): void {
    this._open.update((current) => (current === dialog ? null : dialog))
  }

  setCurrentRow(row: Task | null): void {
    this._currentRow.set(row)
  }

  addTask(input: Omit<Task, 'id'> & { id?: string }): Task {
    const task: Task = { ...input, id: input.id ?? this.uniqueTaskId() }
    this._tasks.update((tasks) => [task, ...tasks])
    return task
  }

  updateTask(
    id: string,
    patch: Partial<Pick<Task, 'title' | 'status' | 'label' | 'priority'>>
  ): void {
    this._tasks.update((tasks) =>
      tasks.map((task) => (task.id === id ? { ...task, ...patch } : task))
    )
    if (this._currentRow()?.id === id) {
      this._currentRow.update((row) => (row ? { ...row, ...patch } : row))
    }
  }

  deleteTask(id: string): void {
    this._tasks.update((tasks) => tasks.filter((task) => task.id !== id))
    if (this._currentRow()?.id === id) this._currentRow.set(null)
  }

  deleteMany(ids: string[]): void {
    const doomed = new Set(ids)
    this._tasks.update((tasks) => tasks.filter((task) => !doomed.has(task.id)))
    if (this._currentRow() && doomed.has(this._currentRow()?.id ?? '')) {
      this._currentRow.set(null)
    }
  }

  /** Functional Labels-submenu action (the source renders it as a no-op). */
  setLabel(id: string, label: TaskLabel): void {
    this.updateTask(id, { label })
  }

  setStatus(id: string, status: TaskStatus): void {
    this.updateTask(id, { status })
  }

  setPriority(id: string, priority: TaskPriority): void {
    this.updateTask(id, { priority })
  }

  /**
   * Generate a `TASK-XXXX` id not already present in the store. Retries with
   * a bounded loop, then falls back to a counter suffix so uniqueness holds
   * even under adversarial collisions.
   */
  private uniqueTaskId(): string {
    const existing = new Set(this._tasks().map((task) => task.id))
    let id = randomTaskId()
    for (let attempt = 0; attempt < 100 && existing.has(id); attempt++) {
      id = randomTaskId()
    }
    if (existing.has(id)) {
      let counter = 1
      while (existing.has(`${id}-${counter}`)) counter++
      id = `${id}-${counter}`
    }
    return id
  }
}
