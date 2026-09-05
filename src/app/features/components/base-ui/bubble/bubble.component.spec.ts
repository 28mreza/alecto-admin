import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { BubbleComponent } from './bubble.component'

describe('BubbleComponent', () => {
  let fixture: ComponentFixture<BubbleComponent>

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
      imports: [BubbleComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(BubbleComponent)
    fixture.detectChanges()
  })

  function text(): string {
    return (fixture.nativeElement as HTMLElement).textContent ?? ''
  }

  it('renders the page heading', () => {
    expect(text()).toContain('Bubble')
  })

  it('renders conversation, variants and reactions demos', () => {
    const content = text()
    expect(content).toContain('Hey there! What is up?')
    expect(content).toContain('Secondary bubble style.')
    expect(content).toContain('Thanks for the quick review!')
  })
})
