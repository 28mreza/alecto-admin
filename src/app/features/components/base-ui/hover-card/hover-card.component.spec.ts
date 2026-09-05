import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { HoverCardComponent } from './hover-card.component'

describe('HoverCardComponent', () => {
  let fixture: ComponentFixture<HoverCardComponent>

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
      imports: [HoverCardComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(HoverCardComponent)
    fixture.detectChanges()
  })

  function text(): string {
    return (fixture.nativeElement as HTMLElement).textContent ?? ''
  }

  it('renders the page heading', () => {
    expect(text()).toContain('Hover Card')
  })

  it('renders both hover triggers', () => {
    const content = text()
    expect(content).toContain('@alecto')
    expect(content).toContain('@mrezadev')
  })
})
