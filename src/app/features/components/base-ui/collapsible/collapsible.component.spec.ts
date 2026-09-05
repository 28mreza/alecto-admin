import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { CollapsibleComponent } from './collapsible.component'

describe('CollapsibleComponent', () => {
  let fixture: ComponentFixture<CollapsibleComponent>

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
      imports: [CollapsibleComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(CollapsibleComponent)
    fixture.detectChanges()
  })

  function text(): string {
    return (fixture.nativeElement as HTMLElement).textContent ?? ''
  }

  it('renders the page heading', () => {
    expect(text()).toContain('Collapsible')
  })

  it('renders closed and open-by-default demos', () => {
    const content = text()
    expect(content).toContain('Can I use this in my project?')
    expect(content).toContain('Shipping details')
    expect(content).toContain('Orders ship within 2 business days.')
  })
})
