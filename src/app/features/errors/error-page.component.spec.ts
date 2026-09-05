import { type ComponentFixture, TestBed } from '@angular/core/testing'
import {
  ActivatedRoute,
  convertToParamMap,
  provideRouter,
} from '@angular/router'
import { of } from 'rxjs'
import { ErrorPageComponent } from './error-page.component'
import { vi } from 'vitest'

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

function setup(errorParam: string | null) {
  mockMatchMedia(false)
  window.localStorage.clear()
  TestBed.configureTestingModule({
    imports: [ErrorPageComponent],
    providers: [
      provideRouter([]),
      {
        provide: ActivatedRoute,
        useValue: {
          paramMap: of(
            convertToParamMap(errorParam ? { error: errorParam } : {})
          ),
        },
      },
    ],
  })
  const fixture: ComponentFixture<ErrorPageComponent> =
    TestBed.createComponent(ErrorPageComponent)
  fixture.detectChanges()
  return fixture
}

describe('ErrorPageComponent', () => {
  function textOf(fixture: ComponentFixture<ErrorPageComponent>): string {
    return (fixture.nativeElement as HTMLElement).textContent ?? ''
  }

  it.each([
    ['unauthorized', '401'],
    ['forbidden', '403'],
    ['not-found', '404'],
    ['internal-server-error', '500'],
    ['maintenance-error', '503'],
  ])('maps param %s to the right error component', (param, code) => {
    const fixture = setup(param)
    expect(textOf(fixture)).toContain(code)
  })

  it('falls back to NotFound for unknown params', () => {
    const fixture = setup('nope')
    expect(textOf(fixture)).toContain('404')
    expect(textOf(fixture)).toContain('Oops! Page Not Found!')
  })

  it('renders the in-app shell with header controls', () => {
    const fixture = setup('forbidden')
    const host = fixture.nativeElement as HTMLElement
    expect(host.querySelector('app-header')).not.toBeNull()
    expect(host.querySelector('app-search')).not.toBeNull()
    expect(host.querySelector('app-theme-switch')).not.toBeNull()
    expect(host.querySelector('app-config-drawer')).not.toBeNull()
    expect(host.querySelector('app-profile-dropdown')).not.toBeNull()
  })

  it('applies border-b on the inner header element (not the host)', () => {
    const fixture = setup('forbidden')
    const host = fixture.nativeElement as HTMLElement
    const innerHeader = host.querySelector('app-header header')
    expect(innerHeader).not.toBeNull()
    expect(innerHeader?.classList.contains('border-b')).toBe(true)
  })

  it('sizes the content to the remaining viewport without scrolling', () => {
    const fixture = setup('not-found')
    const host = fixture.nativeElement as HTMLElement
    const content = host.querySelector(':scope > div') as HTMLElement | null
    expect(content).not.toBeNull()
    expect(content?.classList.contains('min-h-[calc(100svh-4rem)]')).toBe(true)
    expect(content?.classList.contains('justify-center')).toBe(true)
    // The error child gives up its own h-svh so the page cannot overflow.
    const child = content?.querySelector(
      'app-not-found-error > div'
    ) as HTMLElement | null
    expect(child).not.toBeNull()
    expect(child?.classList.contains('h-svh')).toBe(false)
    expect(child?.classList.contains('h-auto')).toBe(true)
  })
})
