import { OverlayContainer } from '@angular/cdk/overlay'
import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { TopNavComponent, type TopNavLink } from './top-nav.component'

const links: TopNavLink[] = [
  { title: 'Overview', href: 'dashboard/overview', isActive: true },
  {
    title: 'Customers',
    href: 'dashboard/customers',
    isActive: false,
    disabled: true,
  },
  { title: 'Settings', href: 'dashboard/settings', isActive: false },
]

describe('TopNavComponent', () => {
  let fixture: ComponentFixture<TopNavComponent>
  let overlay: HTMLElement

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TopNavComponent],
      providers: [provideRouter([])],
    })
    fixture = TestBed.createComponent(TopNavComponent)
    fixture.componentRef.setInput('links', links)
    overlay = TestBed.inject(OverlayContainer).getContainerElement()
    fixture.detectChanges()
  })

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement
  }

  function nav(): HTMLElement {
    return host().querySelector('nav') as HTMLElement
  }

  it('renders the responsive nav container classes', () => {
    expect(nav().classList.contains('hidden')).toBe(true)
    expect(nav().classList.contains('lg:flex')).toBe(true)
    expect(nav().classList.contains('xl:space-x-6')).toBe(true)
  })

  it('renders an anchor per active/inactive link', () => {
    const anchors = nav().querySelectorAll('a')
    expect(anchors.length).toBe(2)
    expect(anchors[0].textContent).toContain('Overview')
    expect(anchors[1].textContent).toContain('Settings')
    expect(anchors[0].getAttribute('href')).toBe('/dashboard/overview')
  })

  it('marks inactive links with the muted foreground', () => {
    const anchors = nav().querySelectorAll('a')
    expect(anchors[0].classList.contains('text-muted-foreground')).toBe(false)
    expect(anchors[1].classList.contains('text-muted-foreground')).toBe(true)
  })

  it('renders disabled links as non-clickable spans', () => {
    const span = nav().querySelector(
      'span[aria-disabled="true"]'
    ) as HTMLElement
    expect(span).not.toBeNull()
    expect(span.textContent).toContain('Customers')
    expect(span.classList.contains('opacity-50')).toBe(true)
    expect(span.classList.contains('pointer-events-none')).toBe(true)
  })

  it('puts a layout-provided className on the host (the header flex item)', () => {
    // Regression: `me-auto` must land on the `app-top-nav` host — the actual
    // flex item in the header row — so following controls (search, theme,
    // profile) are pushed to the far right. The React source returns a
    // fragment, so its className lands directly on the flex items; the
    // Angular host wrapper breaks that unless className is bound on the host
    // (same pattern as SearchComponent).
    fixture.componentRef.setInput('className', 'me-auto')
    fixture.detectChanges()
    expect(host().classList.contains('me-auto')).toBe(true)
  })

  function trigger(): HTMLButtonElement {
    return host().querySelector(
      'button[data-slot="dropdown-menu-trigger"]'
    ) as HTMLButtonElement
  }

  async function openMenu(): Promise<void> {
    trigger().click()
    fixture.detectChanges()
    await fixture.whenStable()
  }

  it('renders a mobile menu trigger hidden on desktop', () => {
    expect(trigger()).not.toBeNull()
    expect(trigger().classList.contains('lg:hidden')).toBe(true)
    expect(trigger().textContent).toContain('Toggle navigation menu')
  })

  it('lists every link in the mobile dropdown menu', async () => {
    await openMenu()
    const items = overlay.querySelectorAll('[data-slot="dropdown-menu-item"]')
    const texts = Array.from(items).map((item) => item.textContent?.trim())
    expect(texts).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Overview'),
        expect.stringContaining('Customers'),
        expect.stringContaining('Settings'),
      ])
    )
    expect(items.length).toBe(3)
  })

  it('renders the disabled mobile item without navigation', async () => {
    await openMenu()
    const disabled = overlay.querySelector(
      'span[data-slot="dropdown-menu-item"][data-disabled]'
    ) as HTMLElement
    expect(disabled).not.toBeNull()
    expect(disabled.textContent).toContain('Customers')
    expect(disabled.hasAttribute('href')).toBe(false)
    expect(disabled.tagName).toBe('SPAN')
  })

  it('marks the inactive mobile link as muted', async () => {
    await openMenu()
    const settings = Array.from(
      overlay.querySelectorAll('[data-slot="dropdown-menu-item"]')
    ).find((item) => item.textContent?.includes('Settings')) as HTMLElement
    expect(settings).not.toBeUndefined()
    expect(settings.classList.contains('text-muted-foreground')).toBe(true)
  })
})
