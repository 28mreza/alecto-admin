import { type Route, type Routes } from '@angular/router'
import { routes } from './app.routes'
import { sidebarData } from './components/layout/data/sidebar-data'

function normalize(url: string): string {
  const path = url.split('?')[0].split('#')[0].replace(/\/+/g, '/')
  if (path.length > 1) return path.replace(/\/+$/, '')
  return path || '/'
}

function joinPath(base: string, segment: string): string {
  return normalize(`${base}/${segment}`)
}

/** Flattens the route tree into full URL patterns (`:param` kept as-is). */
function flattenRoutes(input: Routes, base = ''): string[] {
  const out: string[] = []
  for (const route of input) {
    const segment = route.path ?? ''
    if (segment === '**') {
      out.push('**')
      continue
    }
    const full = joinPath(base, segment)
    out.push(full)
    if (route.children) out.push(...flattenRoutes(route.children, full))
  }
  return out
}

/** True when a concrete URL matches a route pattern (`:param` = any segment). */
function matchesPattern(pattern: string, url: string): boolean {
  if (pattern === url) return true
  const patternSegments = pattern.split('/')
  const urlSegments = url.split('/')
  if (patternSegments.length !== urlSegments.length) return false
  return patternSegments.every(
    (segment, index) =>
      segment.startsWith(':') || segment === urlSegments[index]
  )
}

function collectSidebarUrls(): string[] {
  const urls: string[] = []
  for (const group of sidebarData.navGroups) {
    for (const item of group.items) {
      if (item.url) urls.push(normalize(item.url))
      for (const sub of item.items ?? []) {
        if (sub.url) urls.push(normalize(sub.url))
      }
    }
  }
  return urls
}

describe('app routes — navigation audit', () => {
  const patterns = flattenRoutes(routes).filter((p) => p !== '**')

  function resolves(url: string): boolean {
    return patterns.some((pattern) => matchesPattern(pattern, url))
  }

  it.each(collectSidebarUrls())('sidebar URL %s resolves to a route', (url) => {
    expect(resolves(url)).toBe(true)
  })

  it('covers every sidebar URL exactly once (no gaps, no duplicates)', () => {
    const urls = collectSidebarUrls()
    const missing = urls.filter((url) => !resolves(url))
    expect(missing).toEqual([])
    expect(new Set(urls).size).toBe(urls.length)
  })

  it('registers the help-center route', () => {
    expect(resolves('/help-center')).toBe(true)
  })

  it('registers the components accordion route', () => {
    expect(resolves('/components/accordion')).toBe(true)
  })

  it('registers the components alert, alert-dialog and aspect-ratio routes', () => {
    for (const url of [
      '/components/alert',
      '/components/alert-dialog',
      '/components/aspect-ratio',
    ]) {
      expect(resolves(url)).toBe(true)
    }
  })

  it('registers the attachment, autocomplete, avatar, badge, breadcrumb and bubble routes', () => {
    for (const url of [
      '/components/attachment',
      '/components/autocomplete',
      '/components/avatar',
      '/components/badge',
      '/components/breadcrumb',
      '/components/bubble',
    ]) {
      expect(resolves(url)).toBe(true)
    }
  })

  it('registers the fourth batch of component routes', () => {
    for (const url of [
      '/components/button',
      '/components/button-group',
      '/components/calendar',
      '/components/card',
      '/components/carousel',
      '/components/chart',
      '/components/checkbox',
      '/components/collapsible',
      '/components/combobox',
      '/components/command',
      '/components/context-menu',
      '/components/data-table',
      '/components/date-picker',
      '/components/dialog',
      '/components/drawer',
      '/components/dropdown-menu',
      '/components/empty',
      '/components/field',
      '/components/hover-card',
      '/components/input-group',
      '/components/input-otp',
      '/components/input',
    ]) {
      expect(resolves(url)).toBe(true)
    }
  })

  it('registers the fifth batch of component routes (item to message)', () => {
    for (const url of [
      '/components/item',
      '/components/kbd',
      '/components/label',
      '/components/marker',
      '/components/menubar',
      '/components/message',
    ]) {
      expect(resolves(url)).toBe(true)
    }
  })

  it('registers the sixth batch of component routes (native-select to questionnaire)', () => {
    for (const url of [
      '/components/native-select',
      '/components/navigation-menu',
      '/components/pagination',
      '/components/popover',
      '/components/progress',
      '/components/questionnaire',
    ]) {
      expect(resolves(url)).toBe(true)
    }
  })

  it('registers the seventh batch of component routes (radio-group to skeleton)', () => {
    for (const url of [
      '/components/radio-group',
      '/components/resizable',
      '/components/scroll-area',
      '/components/select',
      '/components/separator',
      '/components/sheet',
      '/components/sidebar',
      '/components/skeleton',
    ]) {
      expect(resolves(url)).toBe(true)
    }
  })

  it('registers auth, standalone error and in-app error routes', () => {
    for (const url of [
      '/sign-in',
      '/sign-in-2',
      '/sign-up',
      '/forgot-password',
      '/otp',
      '/401',
      '/403',
      '/404',
      '/500',
      '/503',
      '/errors/unauthorized',
      '/errors/forbidden',
      '/errors/not-found',
      '/errors/internal-server-error',
      '/errors/maintenance-error',
    ]) {
      expect(resolves(url)).toBe(true)
    }
  })

  it('registers every settings route', () => {
    for (const url of [
      '/settings',
      '/settings/account',
      '/settings/appearance',
      '/settings/notifications',
      '/settings/display',
    ]) {
      expect(resolves(url)).toBe(true)
    }
  })

  it('keeps a catch-all ** route that renders the 404 page', () => {
    const flat: { route: Route; full: string }[] = []
    function walk(input: Routes, base = ''): void {
      for (const route of input) {
        if (route.path === '**') {
          flat.push({ route, full: '**' })
          continue
        }
        const full = joinPath(base, route.path ?? '')
        if (route.children) walk(route.children, full)
      }
    }
    walk(routes)
    // The catch-all must be the final top-level route (no NG04004 loops).
    const topLevelWildcard = routes.findIndex((r) => r.path === '**')
    expect(topLevelWildcard).toBe(routes.length - 1)
    expect(flat.length).toBeGreaterThan(0)
  })
})
