import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { AlertComponent } from './alert.component'

describe('AlertComponent', () => {
  let fixture: ComponentFixture<AlertComponent>

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
      imports: [AlertComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(AlertComponent)
    fixture.detectChanges()
  })

  function text(): string {
    return (fixture.nativeElement as HTMLElement).textContent ?? ''
  }

  it('renders the page heading', () => {
    expect(text()).toContain('Alert')
  })

  it('renders basic, destructive, action and custom-color demos', () => {
    const content = text()
    expect(content).toContain('Payment successful')
    expect(content).toContain('Payment failed')
    expect(content).toContain('Dark mode is now available')
    expect(content).toContain('Your subscription will expire in 3 days.')
  })
})
