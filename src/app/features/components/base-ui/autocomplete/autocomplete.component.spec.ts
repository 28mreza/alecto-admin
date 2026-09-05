import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { AutocompleteComponent } from './autocomplete.component'

describe('AutocompleteComponent', () => {
  let fixture: ComponentFixture<AutocompleteComponent>

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
      imports: [AutocompleteComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(AutocompleteComponent)
    fixture.detectChanges()
  })

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement
  }

  it('renders the page heading', () => {
    expect(host().textContent).toContain('Autocomplete')
  })

  it('renders all three autocomplete inputs', () => {
    const placeholders = [...host().querySelectorAll('input')].map((input) =>
      input.getAttribute('placeholder')
    )
    expect(placeholders).toEqual(
      expect.arrayContaining([
        'Search frameworks',
        'Search food',
        'Search with clear',
      ])
    )
  })
})
