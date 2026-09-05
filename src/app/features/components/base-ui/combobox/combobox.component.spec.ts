import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { ComboboxComponent } from './combobox.component'

describe('ComboboxComponent', () => {
  let fixture: ComponentFixture<ComboboxComponent>

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
      imports: [ComboboxComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(ComboboxComponent)
    fixture.detectChanges()
  })

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement
  }

  it('renders the page heading', () => {
    expect(host().textContent).toContain('Combobox')
  })

  it('renders both combobox inputs with empty selection', () => {
    const placeholders = [...host().querySelectorAll('input')].map((input) =>
      input.getAttribute('placeholder')
    )
    expect(placeholders).toEqual(
      expect.arrayContaining(['Select a framework', 'Select a library'])
    )
    expect(host().textContent).toContain('Selected: none')
  })
})
