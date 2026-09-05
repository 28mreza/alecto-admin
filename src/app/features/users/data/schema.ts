/**
 * User model for the Users feature.
 *
 * Ported from `shadcn-admin/src/features/users/data/schema.ts` (the source
 * uses a zod schema; here the unions are narrowed so templates and the
 * store stay type-safe).
 */
export type UserStatus = 'active' | 'inactive' | 'invited' | 'suspended'

export type UserRole = 'superadmin' | 'admin' | 'cashier' | 'manager'

export interface User {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  phoneNumber: string
  status: UserStatus
  role: UserRole
  createdAt: Date
  updatedAt: Date
}
