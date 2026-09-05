import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { BadgeComponent } from './badge.component'

describe('BadgeComponent', () => {
  let fixture: ComponentFixture<BadgeComponent>

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
      imports: [BadgeComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(BadgeComponent)
    fixture.detectChanges()
  })

  function text(): string {
    return (fixture.nativeElement as HTMLElement).textContent ?? ''
  }

  it('renders the page heading', () => {
    expect(text()).toContain('Badge')
  })

  it('renders variants, icon and status demos', () => {
    const content = text()
    expect(content).toContain('Destructive')
    expect(content).toContain('Verified')
    expect(content).toContain('In Review')
    expect(content).toContain('Published')
  })
})
