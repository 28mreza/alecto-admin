import type { UserStatus } from './schema'

/**
 * Status → badge color classes for the Users feature.
 *
 * Ported verbatim from `shadcn-admin/src/features/users/data/data.ts`
 * (the source uses a `Map`; here a `Record` so templates can index it
 * directly). The source stores lucide-react component references for roles;
 * here icons are ng-icon name strings (the `FacetOption.icon` pattern from
 * Task 15) so both the faceted filters and the role cells can render them.
 * Consumers must register these names via `provideIcons` —
 * `UsersTableComponent` does.
 */
export const callTypes: Record<UserStatus, string> = {
  active: 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200',
  inactive: 'bg-neutral-300/40 border-neutral-300',
  invited: 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300',
  suspended:
    'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
}

export interface UserRoleOption {
  label: string
  value: string
  icon: string
}

export const roles: UserRoleOption[] = [
  { label: 'Superadmin', value: 'superadmin', icon: 'lucideShield' },
  { label: 'Admin', value: 'admin', icon: 'lucideUserCheck' },
  { label: 'Manager', value: 'manager', icon: 'lucideUsers' },
  { label: 'Cashier', value: 'cashier', icon: 'lucideCreditCard' },
]

export const statuses: { label: string; value: UserStatus }[] = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Invited', value: 'invited' },
  { label: 'Suspended', value: 'suspended' },
]
