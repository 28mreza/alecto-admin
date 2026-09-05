import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { ChartComponent } from './chart.component'

describe('ChartComponent', () => {
  let fixture: ComponentFixture<ChartComponent>

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
    // TanStack charts observe container size; jsdom has no ResizeObserver.
    Object.defineProperty(window, 'ResizeObserver', {
      writable: true,
      value: class {
        observe(): void {
          // jsdom stub: no-op
        }
        unobserve(): void {
          // jsdom stub: no-op
        }
        disconnect(): void {
          // jsdom stub: no-op
        }
      },
    })
    await TestBed.configureTestingModule({
      imports: [ChartComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(ChartComponent)
    fixture.detectChanges()
  })

  function text(): string {
    return (fixture.nativeElement as HTMLElement).textContent ?? ''
  }

  it('renders the page heading', () => {
    expect(text()).toContain('Chart')
  })

  it('renders bar and horizontal demos', () => {
    const content = text()
    expect(content).toContain('Monthly revenue, vertical bars.')
    expect(content).toContain('Same data, horizontal bars.')
  })
})
