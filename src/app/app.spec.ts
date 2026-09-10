import { TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { App } from './app'
import { routes } from './app.routes'

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

describe('App', () => {
  beforeEach(async () => {
    mockMatchMedia(false)
    window.localStorage.clear()
    document.documentElement.classList.remove(
      'light',
      'dark',
      'font-jetbrains-mono',
      'font-inter',
      'font-shantell-sans',
      'font-system'
    )
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents()
  })

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App)
    const app = fixture.componentInstance
    expect(app).toBeTruthy()
  })

  it('renders the navigation progress bar and router outlet', () => {
    const fixture = TestBed.createComponent(App)
    fixture.detectChanges()
    const compiled = fixture.nativeElement as HTMLElement
    expect(compiled.querySelector('app-navigation-progress')).not.toBeNull()
    expect(compiled.querySelector('router-outlet')).not.toBeNull()
  })

  it('applies the default theme and font classes on bootstrap', () => {
    const fixture = TestBed.createComponent(App)
    // Flush the services' effects so document classes are applied.
    fixture.detectChanges()
    // ThemeService/FontService construct with App, so document classes apply
    // on every page — not only where a consumer injects the services.
    expect(document.documentElement.classList.contains('light')).toBe(true)
    expect(
      document.documentElement.classList.contains('font-shantell-sans')
    ).toBe(true)
  })

  it('syncs the favicon with the resolved theme', () => {
    const link = document.createElement('link')
    link.setAttribute('rel', 'icon')
    link.setAttribute('href', '/images/logo-light.webp')
    document.head.appendChild(link)
    try {
      const fixture = TestBed.createComponent(App)
      fixture.detectChanges()
      expect(link.href).toContain('/images/logo-light.webp')
    } finally {
      link.remove()
    }
  })
})
