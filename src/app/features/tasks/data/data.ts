import type { TaskLabel, TaskPriority, TaskStatus } from './schema'

/**
 * Label/status/priority metadata for the Tasks feature.
 *
 * Ported from `shadcn-admin/src/features/tasks/data/data.tsx`. The source
 * stores lucide-react component references; here icons are ng-icon name
 * strings (the `FacetOption.icon` pattern from Task 15) so both the faceted
 * filters and the status/priority cells can render them. Consumers must
 * register these names via `provideIcons` — `TasksTableComponent` does.
 */
export interface TaskFacetOption {
  value: string
  label: string
  icon?: string
}

export const taskLabels: TaskFacetOption[] = [
  { value: 'bug', label: 'Bug' },
  { value: 'feature', label: 'Feature' },
  { value: 'documentation', label: 'Documentation' },
]

export const taskStatuses: (TaskFacetOption & { value: TaskStatus })[] = [
  { label: 'Backlog', value: 'backlog', icon: 'lucideCircleHelp' },
  { label: 'Todo', value: 'todo', icon: 'lucideCircle' },
  { label: 'In Progress', value: 'in progress', icon: 'lucideTimer' },
  { label: 'Done', value: 'done', icon: 'lucideCircleCheck' },
  { label: 'Canceled', value: 'canceled', icon: 'lucideCircleOff' },
]

export const taskPriorities: (TaskFacetOption & { value: TaskPriority })[] = [
  { label: 'Low', value: 'low', icon: 'lucideArrowDown' },
  { label: 'Medium', value: 'medium', icon: 'lucideArrowRight' },
  { label: 'High', value: 'high', icon: 'lucideArrowUp' },
  { label: 'Critical', value: 'critical', icon: 'lucideCircleAlert' },
]

export function taskLabel(value: TaskLabel): string {
  return taskLabels.find((option) => option.value === value)?.label ?? value
}

export function taskStatus(value: TaskStatus): TaskFacetOption {
  return (
    taskStatuses.find((option) => option.value === value) ?? {
      value,
      label: value,
    }
  )
}

export function taskPriority(value: TaskPriority): TaskFacetOption {
  return (
    taskPriorities.find((option) => option.value === value) ?? {
      value,
      label: value,
    }
  )
}
