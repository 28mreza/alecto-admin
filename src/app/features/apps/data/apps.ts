import type { BrandIconName } from '../../../shared/icons/brand/brand-icon.component'

export type AppType = 'all' | 'connected' | 'notConnected'

export type AppSort = 'asc' | 'desc'

export interface AppIntegration {
  name: string
  logo: BrandIconName
  connected: boolean
  desc: string
}

export interface AppsFilter {
  searchTerm: string
  type: AppType
  sort: AppSort
}

/**
 * App integrations ported verbatim from
 * `shadcn-admin/src/features/apps/data/apps.tsx` — the React logo
 * components are replaced with `BrandIconComponent` names.
 */
export const apps: AppIntegration[] = [
  {
    name: 'Telegram',
    logo: 'telegram',
    connected: false,
    desc: 'Connect with Telegram for real-time communication.',
  },
  {
    name: 'Notion',
    logo: 'notion',
    connected: true,
    desc: 'Effortlessly sync Notion pages for seamless collaboration.',
  },
  {
    name: 'Figma',
    logo: 'figma',
    connected: true,
    desc: 'View and collaborate on Figma designs in one place.',
  },
  {
    name: 'Trello',
    logo: 'trello',
    connected: false,
    desc: 'Sync Trello cards for streamlined project management.',
  },
  {
    name: 'Slack',
    logo: 'slack',
    connected: false,
    desc: 'Integrate Slack for efficient team communication',
  },
  {
    name: 'Zoom',
    logo: 'zoom',
    connected: true,
    desc: 'Host Zoom meetings directly from the dashboard.',
  },
  {
    name: 'Stripe',
    logo: 'stripe',
    connected: false,
    desc: 'Easily manage Stripe transactions and payments.',
  },
  {
    name: 'Gmail',
    logo: 'gmail',
    connected: true,
    desc: 'Access and manage Gmail messages effortlessly.',
  },
  {
    name: 'Medium',
    logo: 'medium',
    connected: false,
    desc: 'Explore and share Medium stories on your dashboard.',
  },
  {
    name: 'Skype',
    logo: 'skype',
    connected: false,
    desc: 'Connect with Skype contacts seamlessly.',
  },
  {
    name: 'Docker',
    logo: 'docker',
    connected: false,
    desc: 'Effortlessly manage Docker containers on your dashboard.',
  },
  {
    name: 'GitHub',
    logo: 'github',
    connected: false,
    desc: 'Streamline code management with GitHub integration.',
  },
  {
    name: 'GitLab',
    logo: 'gitlab',
    connected: false,
    desc: 'Efficiently manage code projects with GitLab integration.',
  },
  {
    name: 'Discord',
    logo: 'discord',
    connected: false,
    desc: 'Connect with Discord for seamless team communication.',
  },
  {
    name: 'WhatsApp',
    logo: 'whatsapp',
    connected: false,
    desc: 'Easily integrate WhatsApp for direct messaging.',
  },
]

/**
 * Pure filter/sort helper mirroring the pipeline in
 * `shadcn-admin/src/features/apps/index.tsx`: sort by name, then filter
 * by connection type, then filter by (case-insensitive) search term.
 * Returns a new array and never mutates the input.
 */
export function filterApps(
  list: AppIntegration[],
  filter: AppsFilter
): AppIntegration[] {
  const term = filter.searchTerm.trim().toLowerCase()
  return [...list]
    .sort((a, b) =>
      filter.sort === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    )
    .filter((app) =>
      filter.type === 'connected'
        ? app.connected
        : filter.type === 'notConnected'
          ? !app.connected
          : true
    )
    .filter((app) => !term || app.name.toLowerCase().includes(term))
}
