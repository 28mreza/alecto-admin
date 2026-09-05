import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { CardComponent } from './card.component'

describe('CardComponent', () => {
  let fixture: ComponentFixture<CardComponent>

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
      imports: [CardComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(CardComponent)
    fixture.detectChanges()
  })

  function text(): string {
    return (fixture.nativeElement as HTMLElement).textContent ?? ''
  }

  it('renders the page heading', () => {
    expect(text()).toContain('Card')
  })

  it('renders login and notification cards', () => {
    const content = text()
    expect(content).toContain('Enter your credentials to continue.')
    expect(content).toContain('Sign In')
    expect(content).toContain('Deploy finished')
    expect(content).toContain('Mark all as read')
  })
})
