import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { SidebarService } from '../../../core/services/sidebar.service'
import { AppSidebarComponent } from './app-sidebar.component'

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

describe('AppSidebarComponent', () => {
  let fixture: ComponentFixture<AppSidebarComponent>

  beforeEach(() => {
    mockMatchMedia(false)
    window.localStorage.clear()
    TestBed.configureTestingModule({
      imports: [AppSidebarComponent],
      providers: [provideRouter([])],
    })
    fixture = TestBed.createComponent(AppSidebarComponent)
    fixture.detectChanges()
  })

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement
  }

  function text(): string {
    return host().textContent ?? ''
  }

  it('exposes the peer class on the host so the inset sibling selectors match', () => {
    expect(host().classList.contains('peer')).toBe(true)
  })

  it('exposes the sidebar data attributes on the host (peer source)', () => {
    expect(host().getAttribute('data-variant')).toBe('floating')
    expect(host().getAttribute('data-state')).toBe('collapsed')
    expect(host().getAttribute('data-collapsible')).toBe('icon')
    expect(host().getAttribute('data-side')).toBe('left')
  })

  it('emits the expanded state on the host when opened', () => {
    const sidebarService = TestBed.inject(SidebarService)
    sidebarService.setOpen(true)
    fixture.detectChanges()
    expect(host().getAttribute('data-collapsible')).toBe('')
    expect(host().getAttribute('data-state')).toBe('expanded')
  })

  it('renders the nav group labels', () => {
    expect(text()).toContain('General')
    expect(text()).toContain('Pages')
    expect(text()).toContain('Other')
  })

  it('renders the top-level links from sidebar-data', () => {
    expect(text()).toContain('Dashboard')
    expect(text()).toContain('Tasks')
    expect(text()).toContain('Apps')
    expect(text()).toContain('Chats')
    expect(text()).toContain('Users')
    expect(text()).toContain('Help Center')
  })

  it('renders collapsible group titles', () => {
    expect(text()).toContain('Auth')
    expect(text()).toContain('Errors')
    expect(text()).toContain('Settings')
  })

  it('renders the Components group with Base UI > Accordion', () => {
    // The sidebar starts collapsed (icon mode), where collapsible children
    // live inside an unopened dropdown template. Open it so the collapsible
    // branch (children in DOM, CSS-hidden until expanded) renders.
    TestBed.inject(SidebarService).setOpen(true)
    fixture.detectChanges()
    expect(text()).toContain('Components')
    expect(text()).toContain('Base UI')
    expect(text()).toContain('Accordion')
  })

  it('renders the new Base UI children', () => {
    TestBed.inject(SidebarService).setOpen(true)
    fixture.detectChanges()
    expect(text()).toContain('Alert')
    expect(text()).toContain('Alert Dialog')
    expect(text()).toContain('Aspect Ratio')
  })

  it('renders the second batch of Base UI children', () => {
    TestBed.inject(SidebarService).setOpen(true)
    fixture.detectChanges()
    expect(text()).toContain('Attachment')
    expect(text()).toContain('Autocomplete')
    expect(text()).toContain('Avatar')
    expect(text()).toContain('Badge')
    expect(text()).toContain('Breadcrumb')
    expect(text()).toContain('Bubble')
  })

  it('renders the fourth batch of Base UI children', () => {
    TestBed.inject(SidebarService).setOpen(true)
    fixture.detectChanges()
    for (const title of [
      'Button',
      'Button Group',
      'Calendar',
      'Card',
      'Carousel',
      'Chart',
      'Checkbox',
      'Collapsible',
      'Combobox',
      'Command',
      'Context Menu',
      'Data Table',
      'Date Picker',
      'Dialog',
      'Drawer',
      'Dropdown Menu',
      'Empty',
      'Field',
      'Hover Card',
      'Input Group',
      'Input OTP',
      'Input',
    ]) {
      expect(text()).toContain(title)
    }
  })

  it('renders the Chats badge', () => {
    expect(text()).toContain('3')
  })

  it('renders the team switcher with the current team', () => {
    expect(text()).toContain('Alecto Admin')
    expect(text()).toContain('Angular + Spartan')
  })

  it('renders the user footer', () => {
    expect(text()).toContain('Muhamad Reza')
    expect(text()).toContain('mrezadev@gmail.com')
  })

  describe('mobile sheet (explicit composition, no projection)', () => {
    let mobileFixture: ComponentFixture<AppSidebarComponent>
    let sidebar: SidebarService

    beforeEach(() => {
      // Fresh injector AFTER mocking mobile: the root SidebarService reads
      // matchMedia once in its constructor, so the outer desktop fixture's
      // instance (isMobile=false) must not leak in here.
      TestBed.resetTestingModule()
      mockMatchMedia(true)
      window.localStorage.clear()
      TestBed.configureTestingModule({
        imports: [AppSidebarComponent],
        providers: [provideRouter([])],
      })
      sidebar = TestBed.inject(SidebarService)
      mobileFixture = TestBed.createComponent(AppSidebarComponent)
      mobileFixture.detectChanges()
    })

    function dialog(): HTMLElement | null {
      return mobileFixture.nativeElement.querySelector(
        'div[role="dialog"][aria-label="Sidebar navigation"]'
      )
    }

    it('renders nothing extra while the sheet is closed', () => {
      expect(dialog()).toBeNull()
    })

    it('shows team switcher, nav groups and user inside the open sheet', () => {
      sidebar.setMobileOpen(true)
      mobileFixture.detectChanges()
      const panel = dialog()
      expect(panel).not.toBeNull()
      expect(panel?.textContent).toContain('Alecto Admin')
      expect(panel?.textContent).toContain('Dashboard')
      expect(panel?.textContent).toContain('General')
      expect(panel?.textContent).toContain('Muhamad Reza')
    })

    it('closes on backdrop click', () => {
      sidebar.setMobileOpen(true)
      mobileFixture.detectChanges()
      const backdrop = dialog()?.querySelector(
        'div[aria-hidden="true"]'
      ) as HTMLElement
      backdrop.click()
      mobileFixture.detectChanges()
      expect(sidebar.mobileOpen()).toBe(false)
      expect(dialog()).toBeNull()
    })

    it('closes on Escape', () => {
      sidebar.setMobileOpen(true)
      mobileFixture.detectChanges()
      expect(dialog()).not.toBeNull()
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      mobileFixture.detectChanges()
      expect(sidebar.mobileOpen()).toBe(false)
      expect(dialog()).toBeNull()
    })
  })
})
