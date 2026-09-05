import type { TableColumn } from '../../../shared/data-table/table-engine'
import type { User } from '../data/schema'

/**
 * Column definitions for the users table.
 *
 * Ported from `shadcn-admin/src/features/users/components/users-columns.tsx`.
 * (The source's `select` checkbox column is owned by `DataTableComponent`
 * via `showSelection`, so it is not repeated here.) Cells are rendered by
 * `UsersTableComponent` templates keyed by column id; the `meta` classes
 * mirror the source `meta.className` values, including the sticky
 * positioning of the select/username columns. `fullName` exposes an
 * `accessorFn` so filtering/sorting/display resolve the derived value.
 */
export const usersColumns: TableColumn<User>[] = [
  {
    id: 'username',
    header: 'Username',
    enableHiding: false,
    // Substring match: the toolbar search box (`searchKey='username'`, as in
    // the source `users-table.tsx`) filters this column with a
    // case-insensitive contains, mirroring TanStack's default string filter.
    filterMode: 'contains',
    meta: {
      className:
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] inset-s-6 ps-0.5 max-md:sticky @4xl/content:table-cell @4xl/content:drop-shadow-none',
    },
  },
  {
    id: 'fullName',
    header: 'Name',
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    meta: { className: 'w-36' },
  },
  {
    id: 'email',
    header: 'Email',
  },
  {
    id: 'phoneNumber',
    header: 'Phone Number',
    enableSorting: false,
  },
  {
    id: 'status',
    header: 'Status',
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'role',
    header: 'Role',
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'actions',
    header: '',
    enableSorting: false,
    enableHiding: false,
    enableGlobalFilter: false,
  },
]
