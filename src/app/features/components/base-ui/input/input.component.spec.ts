import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { InputComponent } from './input.component'

describe('InputComponent', () => {
  let fixture: ComponentFixture<InputComponent>

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
      imports: [InputComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(InputComponent)
    fixture.detectChanges()
  })

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement
  }

  it('renders the page heading', () => {
    expect(host().textContent).toContain('Input')
  })

  it('renders basic, labelled and typed inputs', () => {
    const placeholders = [...host().querySelectorAll('input')].map((input) =>
      input.getAttribute('placeholder')
    )
    expect(placeholders).toEqual(
      expect.arrayContaining([
        'Type something...',
        'mrezadev',
        'Email',
        'Enter a valid code',
      ])
    )
    expect(host().textContent).toContain('Code must be 6 digits.')
  })
})
