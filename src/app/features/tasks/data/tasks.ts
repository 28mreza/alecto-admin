import { faker } from '@faker-js/faker'
import type { Task } from './schema'

// Fixed seed for consistent data generation (mirrors the source
// `shadcn-admin/src/features/tasks/data/tasks.ts`).
faker.seed(12345)

const STATUSES = ['todo', 'in progress', 'done', 'canceled', 'backlog'] as const
const LABELS = ['bug', 'feature', 'documentation'] as const
const PRIORITIES = ['low', 'medium', 'high'] as const

/**
 * 100 seeded demo tasks. The faker call order per iteration mirrors the
 * source file exactly (id, title, status, label, priority, createdAt,
 * updatedAt, assignee, description, dueDate); the five trailing draws are
 * consumed and discarded so faker's RNG state stays in lockstep with a
 * seeded React run and rows 2–100 match. Only the five table fields are kept
 * — the `Task` interface is unchanged.
 */
export const tasks: Task[] = Array.from({ length: 100 }, () => {
  const task: Task = {
    id: `TASK-${faker.number.int({ min: 1000, max: 9999 })}`,
    title: faker.lorem.sentence({ min: 5, max: 15 }),
    status: faker.helpers.arrayElement(STATUSES),
    label: faker.helpers.arrayElement(LABELS),
    priority: faker.helpers.arrayElement(PRIORITIES),
  }
  // Discarded draws, kept in exact source order for seed parity.
  faker.date.past()
  faker.date.recent()
  faker.person.fullName()
  faker.lorem.paragraph({ min: 1, max: 3 })
  faker.date.future()
  return task
})
