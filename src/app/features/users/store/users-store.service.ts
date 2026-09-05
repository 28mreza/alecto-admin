import { Injectable, signal } from '@angular/core'
import type { User } from '../data/schema'
import { users as seedUsers } from '../data/users'

/** Which dialog the users page has open (`null` = none). */
export type UsersDialog = 'invite' | 'add' | 'edit' | 'delete'

function randomUserId(): string {
  return crypto.randomUUID()
}

/**
 * Page-scoped users state.
 *
 * Mirrors `users-provider.tsx` (dialog state with toggle semantics +
 * `currentRow`) plus the row mutations the dialogs and row/bulk actions
 * need. Deliberately NOT `providedIn: 'root'` — `UsersComponent` provides it
 * so each visit to `/users` starts from the seeded list.
 */
@Injectable()
export class UsersStoreService {
  private readonly _users = signal<User[]>([...seedUsers])
  private readonly _open = signal<UsersDialog | null>(null)
  private readonly _currentRow = signal<User | null>(null)

  readonly users = this._users.asReadonly()
  readonly open = this._open.asReadonly()
  readonly currentRow = this._currentRow.asReadonly()

  /**
   * Toggle semantics matching the source `useDialogState`: opening the
   * already-open dialog closes it again.
   */
  setOpen(dialog: UsersDialog | null): void {
    this._open.update((current) => (current === dialog ? null : dialog))
  }

  setCurrentRow(row: User | null): void {
    this._currentRow.set(row)
  }

  addUser(
    input: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & {
      id?: string
    }
  ): User {
    const now = new Date()
    const user: User = {
      ...input,
      id: input.id ?? randomUserId(),
      createdAt: now,
      updatedAt: now,
    }
    this._users.update((users) => [user, ...users])
    return user
  }

  updateUser(
    id: string,
    patch: Partial<
      Pick<
        User,
        | 'firstName'
        | 'lastName'
        | 'username'
        | 'email'
        | 'phoneNumber'
        | 'status'
        | 'role'
      >
    >
  ): void {
    this._users.update((users) =>
      users.map((user) =>
        user.id === id ? { ...user, ...patch, updatedAt: new Date() } : user
      )
    )
    if (this._currentRow()?.id === id) {
      this._currentRow.update((row) => (row ? { ...row, ...patch } : row))
    }
  }

  deleteUser(id: string): void {
    this._users.update((users) => users.filter((user) => user.id !== id))
    if (this._currentRow()?.id === id) this._currentRow.set(null)
  }

  deleteMany(ids: string[]): void {
    const doomed = new Set(ids)
    this._users.update((users) => users.filter((user) => !doomed.has(user.id)))
    if (this._currentRow() && doomed.has(this._currentRow()?.id ?? '')) {
      this._currentRow.set(null)
    }
  }
}
