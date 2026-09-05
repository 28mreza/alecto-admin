import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { CarouselComponent } from './carousel.component'

describe('CarouselComponent', () => {
  let fixture: ComponentFixture<CarouselComponent>

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
    // Embla observes container size; jsdom has no ResizeObserver.
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
      imports: [CarouselComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(CarouselComponent)
    fixture.detectChanges()
  })

  function text(): string {
    return (fixture.nativeElement as HTMLElement).textContent ?? ''
  }

  it('renders the page heading', () => {
    expect(text()).toContain('Carousel')
  })

  it('renders basic, multiple and vertical demos', () => {
    const content = text()
    expect(content).toContain('Multiple')
    expect(content).toContain('Vertical')
    expect(content).toContain('Slide 1')
  })
})
