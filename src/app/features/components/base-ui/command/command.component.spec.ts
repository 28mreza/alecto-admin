import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { CommandComponent } from './command.component'

describe('CommandComponent', () => {
  let fixture: ComponentFixture<CommandComponent>

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
    // Brain command highlights the first item on init via scrollIntoView,
    // which jsdom does not implement.
    Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
      writable: true,
      value: vi.fn(),
    })
    await TestBed.configureTestingModule({
      imports: [CommandComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(CommandComponent)
    fixture.detectChanges()
  })

  function text(): string {
    return (fixture.nativeElement as HTMLElement).textContent ?? ''
  }

  it('renders the page heading', () => {
    expect(text()).toContain('Command')
  })

  it('renders both command lists with a last-run readout', () => {
    const content = text()
    expect(content).toContain('Dashboard')
    expect(content).toContain('New File')
    expect(content).toContain('Last run: none')
  })
})
