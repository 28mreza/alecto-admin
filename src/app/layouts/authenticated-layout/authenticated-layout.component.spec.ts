import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { AuthenticatedLayoutComponent } from './authenticated-layout.component'
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

describe('AuthenticatedLayoutComponent (sidebar sibling structure)', () => {
  let fixture: ComponentFixture<AuthenticatedLayoutComponent>

  beforeEach(() => {
    mockMatchMedia(false)
    window.localStorage.clear()
    // jsdom has no scrollIntoView; the command palette's brain items call it
    // when keyboard-tracking the active item (even while the dialog is closed).
    ensureScrollIntoViewStub()
    TestBed.configureTestingModule({
      imports: [AuthenticatedLayoutComponent],
      providers: [provideRouter([])],
    })
    fixture = TestBed.createComponent(AuthenticatedLayoutComponent)
    fixture.detectChanges()
  })

  it('renders the app-app-sidebar as the peer sibling preceding the inset', () => {
    const host = fixture.nativeElement as HTMLElement
    const sidebar = host.querySelector('app-app-sidebar') as HTMLElement
    const inset = host.querySelector('app-sidebar-inset') as HTMLElement

    expect(sidebar).not.toBeNull()
    expect(inset).not.toBeNull()
    // .peer[data-variant] must be a PRECEDING SIBLING of the inset host.
    expect(sidebar.classList.contains('peer')).toBe(true)
    expect(sidebar.getAttribute('data-variant')).toBe('floating')
    expect(sidebar.nextElementSibling).toBe(inset)
  })

  it('puts the peer-data inset classes on the inset host element', () => {
    const host = fixture.nativeElement as HTMLElement
    const inset = host.querySelector('app-sidebar-inset') as HTMLElement
    const className = inset.className
    expect(className).toContain('md:peer-data-[variant=inset]:m-2')
    expect(className).toContain('flex-1')
    expect(className).toContain('min-w-0')
  })
})
