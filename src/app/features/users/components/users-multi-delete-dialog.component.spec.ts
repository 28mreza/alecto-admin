import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { toast, toastState } from '@spartan-ng/brain/sonner'
import { vi } from 'vitest'
import {
  isUsersMultiDeleteConfirmed,
  USERS_DELETE_CONFIRM_WORD,
  UsersMultiDeleteDialogComponent,
} from './users-multi-delete-dialog.component'
import { UsersStoreService } from '../store/users-store.service'

describe('isUsersMultiDeleteConfirmed', () => {
  it('only accepts the DELETE word', () => {
    expect(isUsersMultiDeleteConfirmed('DELETE')).toBe(true)
    expect(isUsersMultiDeleteConfirmed(' DELETE ')).toBe(true)
    expect(isUsersMultiDeleteConfirmed('WRONG')).toBe(false)
    expect(isUsersMultiDeleteConfirmed('')).toBe(false)
  })
})

describe('UsersMultiDeleteDialogComponent', () => {
  let fixture: ComponentFixture<UsersMultiDeleteDialogComponent>
  let store: UsersStoreService

  const selectedIds = (): string[] =>
    store
      .users()
      .slice(0, 2)
      .map((user) => user.id)

  beforeEach(async () => {
    document.body.innerHTML = ''
    toast.dismiss()
    await TestBed.configureTestingModule({
      imports: [UsersMultiDeleteDialogComponent],
      providers: [UsersStoreService],
    }).compileComponents()
    store = TestBed.inject(UsersStoreService)
    fixture = TestBed.createComponent(UsersMultiDeleteDialogComponent)
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
      '#users-multi-delete-input'
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

    confirmInput().value = USERS_DELETE_CONFIRM_WORD
    confirmInput().dispatchEvent(new Event('input'))
    fixture.detectChanges()
    expect(deleteButton().disabled).toBe(false)
  })

  it('rejects a wrong confirm word with an error toast and no deletion', () => {
    confirmInput().value = 'WRONG'
    confirmInput().dispatchEvent(new Event('input'))
    fixture.detectChanges()

    document.body
      .querySelector('form#users-multi-delete-form')
      ?.dispatchEvent(new Event('submit'))
    fixture.detectChanges()

    expect(store.users()).toHaveLength(500)
    const toasts = toastState.toasts()
    expect(
      toasts.some((t) => t.title === `Please type "DELETE" to confirm.`)
    ).toBe(true)
  })

  it('deletes the selected users on DELETE confirm and emits deleted', () => {
    const deleted = vi.fn()
    fixture.componentInstance.deleted.subscribe(deleted)
    const ids = selectedIds()

    confirmInput().value = USERS_DELETE_CONFIRM_WORD
    confirmInput().dispatchEvent(new Event('input'))
    fixture.detectChanges()

    document.body
      .querySelector('form#users-multi-delete-form')
      ?.dispatchEvent(new Event('submit'))
    fixture.detectChanges()

    expect(store.users()).toHaveLength(498)
    for (const id of ids) {
      expect(store.users().some((user) => user.id === id)).toBe(false)
    }
    expect(deleted).toHaveBeenCalledWith(ids)
  })
})
