import { faker } from '@faker-js/faker'
import type { User, UserRole, UserStatus } from './schema'

// Fixed seed for consistent data generation (mirrors the source
// `shadcn-admin/src/features/users/data/users.ts`).
faker.seed(67890)

const STATUSES: UserStatus[] = ['active', 'inactive', 'invited', 'suspended']
const ROLES: UserRole[] = ['superadmin', 'admin', 'cashier', 'manager']

/**
 * 500 seeded demo users. The faker call order per iteration mirrors the
 * source file exactly (firstName, lastName, uuid, username, email,
 * phoneNumber, status, role, createdAt past, updatedAt recent) so a seeded
 * run stays in lockstep with the React app.
 */
export const users: User[] = Array.from({ length: 500 }, () => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  return {
    id: faker.string.uuid(),
    firstName,
    lastName,
    username: faker.internet
      .username({ firstName, lastName })
      .toLocaleLowerCase(),
    email: faker.internet.email({ firstName }).toLocaleLowerCase(),
    phoneNumber: faker.phone.number({ style: 'international' }),
    status: faker.helpers.arrayElement(STATUSES),
    role: faker.helpers.arrayElement(ROLES),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }
})
