import { TestBed } from '@angular/core/testing'
import { provideRouter, Router } from '@angular/router'
import { vi } from 'vitest'
import { App } from './app'
import { routes } from './app.routes'

function mockBrowserApis(): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  })
  // jsdom lacks scrollIntoView (used by the Spartan command palette).
  Object.defineProperty(window.Element.prototype, 'scrollIntoView', {
    writable: true,
    value: vi.fn(),
  })
}

/**
 * Regression test for the blank `/` page ("hanya tulisan Alecto Admin").
 *
 * Both layout shells use `path: ''`. An empty-path parent with a component
 * matches `/` even when none of its children match, leaving a blank outlet.
 * With AuthLayout first, `/` rendered the public shell ("Alecto Admin") with
 * an empty outlet instead of the dashboard. The authenticated shell must
 * therefore come first so its `path: '' pathMatch: 'full'` dashboard child
 * claims `/`.
 */
describe('App navigation — layout shells', () => {
  beforeEach(async () => {
    mockBrowserApis()
    window.localStorage.clear()
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents()
  })

  async function navigateHtml(url: string): Promise<string> {
    const fixture = TestBed.createComponent(App)
    fixture.detectChanges()
    const router = TestBed.inject(Router)
    await router.navigateByUrl(url)
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()
    return (fixture.nativeElement as HTMLElement).innerHTML
  }

  it('renders the dashboard (not a blank auth shell) at /', async () => {
    const html = await navigateHtml('/')
    expect(html).toContain('app-authenticated-layout')
    expect(html).not.toContain('app-auth-layout')
    expect(html).toContain('Total Revenue')
    expect(html).toContain('Recent Sales')
  })

  it('still renders auth pages inside the public shell', async () => {
    const html = await navigateHtml('/sign-in')
    expect(html).toContain('app-auth-layout')
    expect(html).toContain('app-sign-in')
  })
})
