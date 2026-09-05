import { TestBed } from '@angular/core/testing'
import { UsersStoreService } from './users-store.service'

describe('UsersStoreService', () => {
  let store: UsersStoreService

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [UsersStoreService] })
    store = TestBed.inject(UsersStoreService)
  })

  it('starts with the 500 seeded users and no open dialog', () => {
    expect(store.users()).toHaveLength(500)
    expect(store.open()).toBeNull()
    expect(store.currentRow()).toBeNull()
  })

  it('toggles dialog state: same value closes, different value switches', () => {
    store.setOpen('add')
    expect(store.open()).toBe('add')

    store.setOpen('add')
    expect(store.open()).toBeNull()

    store.setOpen('edit')
    expect(store.open()).toBe('edit')
    store.setOpen('invite')
    expect(store.open()).toBe('invite')
    store.setOpen('delete')
    expect(store.open()).toBe('delete')
    store.setOpen(null)
    expect(store.open()).toBeNull()
  })

  it('tracks the current row', () => {
    const row = store.users()[0]
    store.setCurrentRow(row)
    expect(store.currentRow()).toEqual(row)
    store.setCurrentRow(null)
    expect(store.currentRow()).toBeNull()
  })

  it('addUser prepends a user with a generated id', () => {
    const before = store.users().length
    const created = store.addUser({
      firstName: 'John',
      lastName: 'Doe',
      username: 'john_doe',
      email: 'john.doe@gmail.com',
      phoneNumber: '+123456789',
      status: 'active',
      role: 'admin',
    })
    expect(created.id).toBeTruthy()
    expect(store.users()).toHaveLength(before + 1)
    expect(store.users()[0]).toEqual(created)
  })

  it('updateUser patches fields by id', () => {
    const target = store.users()[0]
    store.updateUser(target.id, {
      firstName: 'Jane',
      status: 'inactive',
      role: 'manager',
    })
    const updated = store.users().find((user) => user.id === target.id)
    expect(updated).toMatchObject({
      firstName: 'Jane',
      status: 'inactive',
      role: 'manager',
    })
  })

  it('updateUser keeps the current row in sync', () => {
    const target = store.users()[0]
    store.setCurrentRow(target)
    store.updateUser(target.id, { status: 'suspended' })
    expect(store.currentRow()?.status).toBe('suspended')
  })

  it('deleteUser removes the user and clears a matching current row', () => {
    const target = store.users()[0]
    store.setCurrentRow(target)
    store.deleteUser(target.id)
    expect(store.users()).toHaveLength(499)
    expect(store.users().some((user) => user.id === target.id)).toBe(false)
    expect(store.currentRow()).toBeNull()
  })

  it('deleteMany removes every selected user', () => {
    const ids = store
      .users()
      .slice(0, 3)
      .map((user) => user.id)
    store.deleteMany(ids)
    expect(store.users()).toHaveLength(497)
    for (const id of ids) {
      expect(store.users().some((user) => user.id === id)).toBe(false)
    }
  })
})
