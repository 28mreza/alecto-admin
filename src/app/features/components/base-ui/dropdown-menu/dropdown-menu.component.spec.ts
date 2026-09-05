import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { DropdownMenuComponent } from './dropdown-menu.component'

describe('DropdownMenuComponent', () => {
  let fixture: ComponentFixture<DropdownMenuComponent>

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
      imports: [DropdownMenuComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(DropdownMenuComponent)
    fixture.detectChanges()
  })

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement
  }

  it('renders the page heading', () => {
    expect(host().textContent).toContain('Dropdown Menu')
  })

  it('renders both menu triggers', () => {
    const buttons = [...host().querySelectorAll('button')].map((b) =>
      b.textContent?.trim()
    )
    expect(buttons).toContain('Open menu')
    expect(buttons).toContain('Actions')
  })
})
