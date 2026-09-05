import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { ButtonComponent } from './button.component'

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<ButtonComponent>

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
      imports: [ButtonComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(ButtonComponent)
    fixture.detectChanges()
  })

  function text(): string {
    return (fixture.nativeElement as HTMLElement).textContent ?? ''
  }

  it('renders the page heading', () => {
    expect(text()).toContain('Button')
  })

  it('renders variants, sizes and icon demos', () => {
    const content = text()
    expect(content).toContain('Destructive')
    expect(content).toContain('Extra Small')
    expect(content).toContain('Create')
    expect(content).toContain('Disabled')
  })
})
