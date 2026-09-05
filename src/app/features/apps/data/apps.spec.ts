import { apps, filterApps } from './apps'

describe('apps data', () => {
  it('contains the 15 integrations verbatim from the source', () => {
    expect(apps).toHaveLength(15)
    expect(apps.map((app) => app.name)).toEqual([
      'Telegram',
      'Notion',
      'Figma',
      'Trello',
      'Slack',
      'Zoom',
      'Stripe',
      'Gmail',
      'Medium',
      'Skype',
      'Docker',
      'GitHub',
      'GitLab',
      'Discord',
      'WhatsApp',
    ])
  })

  it('marks only Notion, Figma, Zoom and Gmail as connected', () => {
    const connected = apps.filter((app) => app.connected).map((app) => app.name)
    expect(connected).toEqual(['Notion', 'Figma', 'Zoom', 'Gmail'])
  })

  it('keeps the source descriptions verbatim (incl. the Slack no-period quirk)', () => {
    const byName = new Map(apps.map((app) => [app.name, app.desc]))
    expect(byName.get('Telegram')).toBe(
      'Connect with Telegram for real-time communication.'
    )
    expect(byName.get('Slack')).toBe(
      'Integrate Slack for efficient team communication'
    )
    expect(byName.get('WhatsApp')).toBe(
      'Easily integrate WhatsApp for direct messaging.'
    )
  })

  it('maps each app to its brand icon name 1:1 (lowercase name)', () => {
    for (const app of apps) {
      expect(app.logo).toBe(app.name.toLowerCase())
    }
  })
})

describe('filterApps', () => {
  const base = { searchTerm: '', type: 'all' as const, sort: 'asc' as const }

  it('sorts ascending by name by default', () => {
    const names = filterApps(apps, base).map((app) => app.name)
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)))
    expect(names[0]).toBe('Discord')
  })

  it('sorts descending by name when sort is desc', () => {
    const names = filterApps(apps, { ...base, sort: 'desc' }).map(
      (app) => app.name
    )
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)))
    expect(names[0]).toBe('Zoom')
  })

  it('filters to connected apps only', () => {
    const result = filterApps(apps, { ...base, type: 'connected' })
    expect(result.map((app) => app.name)).toEqual([
      'Figma',
      'Gmail',
      'Notion',
      'Zoom',
    ])
  })

  it('filters to not-connected apps only', () => {
    const result = filterApps(apps, { ...base, type: 'notConnected' })
    expect(result).toHaveLength(11)
    expect(result.every((app) => !app.connected)).toBe(true)
  })

  it('filters by search term case-insensitively', () => {
    const result = filterApps(apps, { ...base, searchTerm: 'GIT' })
    expect(result.map((app) => app.name)).toEqual(['GitHub', 'GitLab'])
  })

  it('trims the search term and combines type + sort + search', () => {
    const result = filterApps(apps, {
      searchTerm: '  git ',
      type: 'notConnected',
      sort: 'desc',
    })
    expect(result.map((app) => app.name)).toEqual(['GitLab', 'GitHub'])
  })

  it('returns an empty list when nothing matches', () => {
    expect(filterApps(apps, { ...base, searchTerm: 'no-such-app' })).toEqual([])
  })

  it('does not mutate the source array', () => {
    const before = apps.map((app) => app.name)
    filterApps(apps, { ...base, sort: 'desc' })
    expect(apps.map((app) => app.name)).toEqual(before)
  })
})
