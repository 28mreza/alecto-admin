import type { TableColumn } from '../../../shared/data-table/table-engine'
import type { Task } from '../data/schema'

/**
 * Column definitions for the tasks table.
 *
 * Ported from `shadcn-admin/src/features/tasks/components/tasks-columns.tsx`.
 * (The source's `select` checkbox column is owned by `DataTableComponent`
 * via `showSelection`, so it is not repeated here.) Cells are rendered by
 * `TasksTableComponent` templates keyed by column id; the `meta` classes
 * mirror the source `meta.className` / `tdClassName` values.
 */
export const tasksColumns: TableColumn<Task>[] = [
  {
    id: 'id',
    header: 'Task',
    enableSorting: false,
    enableHiding: false,
    meta: { className: 'w-20' },
  },
  {
    id: 'title',
    header: 'Title',
    meta: { className: 'ps-1 max-w-0 w-2/3', tdClassName: 'ps-4' },
  },
  {
    id: 'status',
    header: 'Status',
    meta: { className: 'ps-1', tdClassName: 'ps-4' },
  },
  {
    id: 'priority',
    header: 'Priority',
    meta: { className: 'ps-1', tdClassName: 'ps-3' },
  },
  {
    id: 'actions',
    header: '',
    enableSorting: false,
    enableHiding: false,
    enableGlobalFilter: false,
  },
]
