export interface User {
  name: string
  email: string
  avatar: string
}

export interface Team {
  name: string
  logo: string
  plan: string
}

export interface BaseNavItem {
  title: string
  badge?: string
  icon?: string
}

export interface NavLink extends BaseNavItem {
  url: string
  items?: never
}

export interface NavCollapsible extends BaseNavItem {
  items: (BaseNavItem & { url: string })[]
  url?: never
}

export type NavItem = NavCollapsible | NavLink

export interface NavGroup {
  title: string
  items: NavItem[]
}

export interface SidebarData {
  user: User
  teams: Team[]
  navGroups: NavGroup[]
}
