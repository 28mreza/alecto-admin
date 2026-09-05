import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { CalendarComponent } from './calendar.component'

describe('CalendarComponent', () => {
  let fixture: ComponentFixture<CalendarComponent>

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
      imports: [CalendarComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(CalendarComponent)
    fixture.detectChanges()
  })

  function text(): string {
    return (fixture.nativeElement as HTMLElement).textContent ?? ''
  }

  it('renders the page heading', () => {
    expect(text()).toContain('Calendar')
  })

  it('renders basic and dropdown demos with selected dates', () => {
    const content = text()
    expect(content).toContain('Dropdown Pickers')
    expect(content).toContain('Selected:')
  })
})
