import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { DashboardComponent } from './dashboard.component'

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  })
}

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>

  beforeEach(() => {
    mockMatchMedia(false)
    window.localStorage.clear()
    TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [provideRouter([])],
    })
    fixture = TestBed.createComponent(DashboardComponent)
    fixture.detectChanges()
  })

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement
  }

  it('renders the dashboard heading and download action', () => {
    const heading = host().querySelector('h1')
    expect(heading?.textContent).toContain('Dashboard')
    const buttons = Array.from(host().querySelectorAll('button')).map((b) =>
      b.textContent?.trim()
    )
    expect(buttons).toContain('Download')
  })

  it('renders the overview and analytics tabs with disabled extras', () => {
    const triggers = host().querySelectorAll('[data-slot="tabs-trigger"]')
    const texts = Array.from(triggers).map((trigger) =>
      trigger.textContent?.trim()
    )
    expect(texts).toEqual(
      expect.arrayContaining([
        'Overview',
        'Analytics',
        'Reports',
        'Notifications',
      ])
    )
    const reports = Array.from(triggers).find(
      (trigger) => trigger.textContent?.trim() === 'Reports'
    ) as HTMLButtonElement
    expect(reports.disabled).toBe(true)
  })

  it('renders the four overview stat cards', () => {
    const text = host().textContent ?? ''
    for (const title of [
      'Total Revenue',
      'Subscriptions',
      'Sales',
      'Active Now',
    ]) {
      expect(text).toContain(title)
    }
    expect(text).toContain('$45,231.89')
    expect(text).toContain('+2350')
    expect(text).toContain('+12,234')
    expect(text).toContain('+573')
  })

  it('renders the overview bar chart and recent sales rows', () => {
    expect(
      host().querySelector('app-overview-chart app-bar-chart')
    ).not.toBeNull()
    const text = host().textContent ?? ''
    expect(text).toContain('Recent Sales')
    expect(text).toContain('You made 265 sales this month.')
    for (const name of [
      'Olivia Martin',
      'Jackson Lee',
      'Isabella Nguyen',
      'William Kim',
      'Sofia Davis',
    ]) {
      expect(text).toContain(name)
    }
  })

  it('renders the analytics tab content', () => {
    const text = host().textContent ?? ''
    expect(text).toContain('Traffic Overview')
    expect(host().querySelector('app-dashboard-analytics')).not.toBeNull()
  })

  it('lays tabs out horizontally like the reference (not vertical)', () => {
    // Regression: `orientation="vertical"` was copied from the React source,
    // but Spartan helm renders a vertical tab rail for it (flex-col list +
    // row root), squeezing the cards into a narrow stacked column on the
    // right. The shadcn reference ignores orientation for layout (always a
    // horizontal list under a flex-col root), so the dashboard must stay on
    // the default horizontal orientation.
    const tabs = host().querySelector('hlm-tabs')
    expect(tabs).not.toBeNull()
    expect(tabs?.getAttribute('data-orientation')).not.toBe('vertical')
  })
})
