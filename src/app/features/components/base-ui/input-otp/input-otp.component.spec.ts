import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { InputOtpComponent } from './input-otp.component'

describe('InputOtpComponent', () => {
  let fixture: ComponentFixture<InputOtpComponent>

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
      imports: [InputOtpComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(InputOtpComponent)
    fixture.detectChanges()
  })

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement
  }

  it('renders the page heading', () => {
    expect(host().textContent).toContain('Input OTP')
  })

  it('renders six and four digit demos with ten slots', () => {
    expect(host().querySelectorAll('hlm-input-otp-slot').length).toBe(10)
    expect(host().textContent).toContain('Six Digit')
    expect(host().textContent).toContain('Four Digit PIN')
  })
})
