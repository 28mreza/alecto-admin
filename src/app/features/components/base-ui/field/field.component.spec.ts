import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { FieldComponent } from './field.component'

describe('FieldComponent', () => {
  let fixture: ComponentFixture<FieldComponent>

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
      imports: [FieldComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(FieldComponent)
    fixture.detectChanges()
  })

  function text(): string {
    return (fixture.nativeElement as HTMLElement).textContent ?? ''
  }

  it('renders the page heading', () => {
    expect(text()).toContain('Field')
  })

  it('renders basic, invalid and checkbox-row demos', () => {
    const content = text()
    expect(content).toContain('Shown on your public profile.')
    expect(content).toContain('Enter a valid email address.')
    expect(content).toContain('Same as shipping address')
  })
})
