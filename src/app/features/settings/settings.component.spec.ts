import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { SettingsComponent } from './settings.component'
import { ensureScrollIntoViewStub } from '../../../test-helpers'

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

describe('SettingsComponent', () => {
  let fixture: ComponentFixture<SettingsComponent>

  beforeEach(async () => {
    mockMatchMedia(false)
    window.localStorage.clear()
    ensureScrollIntoViewStub()
    await TestBed.configureTestingModule({
      imports: [SettingsComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(SettingsComponent)
    fixture.detectChanges()
  })

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement
  }

  it('renders the settings heading and description', () => {
    const heading = host().querySelector('h1')
    expect(heading?.textContent).toContain('Settings')
    expect(host().textContent).toContain(
      'Manage your account settings and set e-mail preferences.'
    )
  })

  it('renders the header actions', () => {
    expect(host().querySelector('app-search')).not.toBeNull()
    expect(host().querySelector('app-theme-switch')).not.toBeNull()
    expect(host().querySelector('app-config-drawer')).not.toBeNull()
    expect(host().querySelector('app-profile-dropdown')).not.toBeNull()
  })

  it('renders all five sidebar nav items', () => {
    const nav = host().querySelector('app-settings-sidebar-nav')
    expect(nav).not.toBeNull()
    const text = nav?.textContent ?? ''
    for (const title of [
      'Profile',
      'Account',
      'Appearance',
      'Notifications',
      'Display',
    ]) {
      expect(text).toContain(title)
    }
    const links = Array.from(nav?.querySelectorAll('nav a') ?? []).map((a) =>
      a.getAttribute('href')
    )
    expect(links).toEqual(
      expect.arrayContaining([
        '/settings',
        '/settings/account',
        '/settings/appearance',
        '/settings/notifications',
        '/settings/display',
      ])
    )
  })

  it('renders a router outlet for the sub-pages', () => {
    expect(host().querySelector('router-outlet')).not.toBeNull()
  })
})
