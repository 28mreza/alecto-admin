import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { ButtonGroupComponent } from './button-group.component'

describe('ButtonGroupComponent', () => {
  let fixture: ComponentFixture<ButtonGroupComponent>

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
      imports: [ButtonGroupComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(ButtonGroupComponent)
    fixture.detectChanges()
  })

  function text(): string {
    return (fixture.nativeElement as HTMLElement).textContent ?? ''
  }

  it('renders the page heading', () => {
    expect(text()).toContain('Button Group')
  })

  it('renders horizontal, split, vertical and input demos', () => {
    const content = text()
    expect(content).toContain('Center')
    expect(content).toContain('Approve')
    expect(content).toContain('https://')
    expect(content).toContain('Visit')
  })
})
