import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { DatePickerComponent } from './date-picker.component'

describe('DatePickerComponent', () => {
  let fixture: ComponentFixture<DatePickerComponent>

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
      imports: [DatePickerComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(DatePickerComponent)
    fixture.detectChanges()
  })

  function text(): string {
    return (fixture.nativeElement as HTMLElement).textContent ?? ''
  }

  it('renders the page heading', () => {
    expect(text()).toContain('Date Picker')
  })

  it('renders single and range demos with picked values', () => {
    const content = text()
    expect(content).toContain('Picked:')
    expect(content).toContain('Range:')
  })
})
