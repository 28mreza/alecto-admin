import { faker } from '@faker-js/faker'
import { tasks } from './tasks'

const STATUSES = ['todo', 'in progress', 'done', 'canceled', 'backlog'] as const
const LABELS = ['bug', 'feature', 'documentation'] as const
const PRIORITIES = ['low', 'medium', 'high'] as const

/**
 * Seed-parity guard for the tasks fixture. The draw sequence mirrors
 * `shadcn-admin/src/features/tasks/data/tasks.ts` exactly (including the
 * five discarded trailing draws per row), so these expectations match a
 * seeded React run. If faker changes its RNG, these fail loudly instead of
 * silently shifting every row.
 */
describe('tasks seed data', () => {
  it('generates 100 tasks with TASK-XXXX ids', () => {
    expect(tasks).toHaveLength(100)
    for (const task of tasks) {
      expect(task.id).toMatch(/^TASK-\d{4}$/)
    }
  })

  it('matches the seeded source output for the first rows', () => {
    expect(tasks[0]).toEqual({
      id: 'TASK-9366',
      title: 'Auctus bardus minus pariatur vobis solitudo tamquam solitudo.',
      status: 'canceled',
      label: 'documentation',
      priority: 'low',
    })
    expect(tasks[1]).toEqual({
      id: 'TASK-5736',
      title:
        'Admoneo vehemens suscipit toties desidero tollo allatus blanditiis caute delibero degenero.',
      status: 'canceled',
      label: 'bug',
      priority: 'medium',
    })
    expect(tasks[2]).toEqual({
      id: 'TASK-3204',
      title:
        'Deputo veritas vinculum expedita casus supplanto corona deserunt calamitas considero soleo coma tenuis.',
      status: 'canceled',
      label: 'documentation',
      priority: 'high',
    })
  })

  it('is deterministic: re-running the same draw sequence reproduces the array', () => {
    faker.seed(12345)
    const again = Array.from({ length: 100 }, () => {
      const task = {
        id: `TASK-${faker.number.int({ min: 1000, max: 9999 })}`,
        title: faker.lorem.sentence({ min: 5, max: 15 }),
        status: faker.helpers.arrayElement(STATUSES),
        label: faker.helpers.arrayElement(LABELS),
        priority: faker.helpers.arrayElement(PRIORITIES),
      }
      faker.date.past()
      faker.date.recent()
      faker.person.fullName()
      faker.lorem.paragraph({ min: 1, max: 3 })
      faker.date.future()
      return task
    })
    expect(again).toEqual(tasks)
  })
})
