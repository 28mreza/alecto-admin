import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { CheckboxComponent } from './checkbox.component'

describe('CheckboxComponent', () => {
  let fixture: ComponentFixture<CheckboxComponent>

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
      imports: [CheckboxComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(CheckboxComponent)
    fixture.detectChanges()
  })

  function text(): string {
    return (fixture.nativeElement as HTMLElement).textContent ?? ''
  }

  it('renders the page heading', () => {
    expect(text()).toContain('Checkbox')
  })

  it('renders basic and disabled demos', () => {
    const content = text()
    expect(content).toContain('Accept terms and conditions')
    expect(content).toContain('Subscribe to newsletter')
    expect(content).toContain('Archived project')
    expect(content).toContain('Deleted project')
  })
})
