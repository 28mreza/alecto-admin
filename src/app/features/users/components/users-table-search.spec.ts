import { TableEngine } from '../../../shared/data-table/table-engine'
import { tableStateToUrl } from '../../../shared/data-table/url-table-state'
import type { User } from '../data/schema'
import { usersColumns } from './users-columns'

const ROWS: User[] = [
  {
    id: 'u-1',
    firstName: 'John',
    lastName: 'Doe',
    username: 'john_doe',
    email: 'someone.else@example.com',
    phoneNumber: '+10000000001',
    status: 'active',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: 'u-2',
    firstName: 'Jane',
    lastName: 'Smith',
    username: 'jane_smith',
    email: 'john_doe@example.com',
    phoneNumber: '+10000000002',
    status: 'invited',
    role: 'manager',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
  },
]

function createEngine(): TableEngine<User> {
  return new TableEngine<User>({ data: ROWS, columns: usersColumns })
}

/**
 * Scope parity with the source `users-table.tsx`: the toolbar search box
 * (`searchKey='username'`, global filter disabled) narrows by the username
 * column only — never by email or full name.
 */
describe('users table search scope', () => {
  it('narrows rows by username substring', () => {
    const engine = createEngine()
    engine.setColumnFilter('username', ['john'])
    expect(engine.rows().map((row) => row.id)).toEqual(['u-1'])
  })

  it('ignores terms that only match email or full name', () => {
    const engine = createEngine()
    // 'john_doe@example.com' is u-2's email; 'Jane Smith' is u-2's name.
    // Neither is a username substring of u-1... 'example.com' matches no
    // username at all.
    engine.setColumnFilter('username', ['example.com'])
    expect(engine.rows()).toEqual([])
    engine.setColumnFilter('username', ['jane smith'])
    expect(engine.rows()).toEqual([])
  })

  it('serializes the search to the `username` URL key (not `filter`)', () => {
    const engine = createEngine()
    engine.setColumnFilter('username', ['john'])
    const params = tableStateToUrl(engine.state())
    expect(params['username']).toEqual(['john'])
    expect(params['filter']).toBeUndefined()
  })
})
