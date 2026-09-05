/**
 * Task model for the Tasks feature.
 *
 * Ported from `shadcn-admin/src/features/tasks/data/schema.ts` (the source
 * uses a zod schema with plain strings; here the unions are narrowed so
 * templates and the store stay type-safe).
 */
export type TaskStatus =
  'backlog' | 'todo' | 'in progress' | 'done' | 'canceled'

export type TaskLabel = 'bug' | 'feature' | 'documentation'

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical'

export interface Task {
  id: string
  title: string
  status: TaskStatus
  label: TaskLabel
  priority: TaskPriority
}
