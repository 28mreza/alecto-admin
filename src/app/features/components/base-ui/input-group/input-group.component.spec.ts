import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { InputGroupComponent } from './input-group.component'

describe('InputGroupComponent', () => {
  let fixture: ComponentFixture<InputGroupComponent>

  beforeEach(async () => {
    // ThemeSwitch (via ThemeService) needs matchMedia, which jsdom lacks —
    // same stub as dashboard/chats page specs.
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    })
    await TestBed.configureTestingModule({
      imports: [InputGroupComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(InputGroupComponent)
    fixture.detectChanges()
  })

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement
  }

  it('renders the page heading', () => {
    expect(host().textContent).toContain('Input Group')
  })

  it('renders prefix, icon and suffix demos', () => {
    expect(host().textContent).toContain('https://')
    expect(host().textContent).toContain('Subscribe')
    const placeholders = [...host().querySelectorAll('input')].map((input) =>
      input.getAttribute('placeholder')
    )
    expect(placeholders).toEqual(
      expect.arrayContaining(['Website URL', 'Search docs...', 'Email address'])
    )
  })
})
