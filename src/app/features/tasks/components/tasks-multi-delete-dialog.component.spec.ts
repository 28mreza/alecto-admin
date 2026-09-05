import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { toast, toastState } from '@spartan-ng/brain/sonner'
import { vi } from 'vitest'
import {
  TASKS_DELETE_CONFIRM_WORD,
  TasksMultiDeleteDialogComponent,
} from './tasks-multi-delete-dialog.component'
import { TasksStoreService } from '../store/tasks-store.service'

describe('TasksMultiDeleteDialogComponent', () => {
  let fixture: ComponentFixture<TasksMultiDeleteDialogComponent>
  let store: TasksStoreService

  const selectedIds = (): string[] =>
    store
      .tasks()
      .slice(0, 2)
      .map((task) => task.id)

  beforeEach(async () => {
    document.body.innerHTML = ''
    toast.dismiss()
    await TestBed.configureTestingModule({
      imports: [TasksMultiDeleteDialogComponent],
      providers: [TasksStoreService],
    }).compileComponents()
    store = TestBed.inject(TasksStoreService)
    fixture = TestBed.createComponent(TasksMultiDeleteDialogComponent)
    fixture.componentRef.setInput('open', true)
    fixture.componentRef.setInput('selectedIds', selectedIds())
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()
  })

  afterEach(() => {
    document.body.innerHTML = ''
    toast.dismiss()
  })

  function confirmInput(): HTMLInputElement {
    const input = document.body.querySelector(
      '#tasks-multi-delete-input'
    ) as HTMLInputElement | null
    expect(input).not.toBeNull()
    return input!
  }

  function deleteButton(): HTMLButtonElement {
    const button = [...document.body.querySelectorAll('button')].find(
      (b) => b.textContent?.trim() === 'Delete'
    ) as HTMLButtonElement | undefined
    expect(button).not.toBeUndefined()
    return button!
  }

  it('keeps Delete disabled until the DELETE word is typed', () => {
    expect(deleteButton().disabled).toBe(true)

    confirmInput().value = 'WRONG'
    confirmInput().dispatchEvent(new Event('input'))
    fixture.detectChanges()
    expect(deleteButton().disabled).toBe(true)

    confirmInput().value = TASKS_DELETE_CONFIRM_WORD
    confirmInput().dispatchEvent(new Event('input'))
    fixture.detectChanges()
    expect(deleteButton().disabled).toBe(false)
  })

  it('rejects a wrong confirm word with an error toast and no deletion', () => {
    confirmInput().value = 'WRONG'
    confirmInput().dispatchEvent(new Event('input'))
    fixture.detectChanges()

    document.body
      .querySelector('form#tasks-multi-delete-form')
      ?.dispatchEvent(new Event('submit'))
    fixture.detectChanges()

    expect(store.tasks()).toHaveLength(100)
    const toasts = toastState.toasts()
    expect(
      toasts.some((t) => t.title === `Please type "DELETE" to confirm.`)
    ).toBe(true)
  })

  it('deletes the selected tasks on DELETE confirm and emits deleted', () => {
    const deleted = vi.fn()
    fixture.componentInstance.deleted.subscribe(deleted)
    const ids = selectedIds()

    confirmInput().value = TASKS_DELETE_CONFIRM_WORD
    confirmInput().dispatchEvent(new Event('input'))
    fixture.detectChanges()

    document.body
      .querySelector('form#tasks-multi-delete-form')
      ?.dispatchEvent(new Event('submit'))
    fixture.detectChanges()

    expect(store.tasks()).toHaveLength(98)
    for (const id of ids) {
      expect(store.tasks().some((task) => task.id === id)).toBe(false)
    }
    expect(deleted).toHaveBeenCalledWith(ids)
  })
})
