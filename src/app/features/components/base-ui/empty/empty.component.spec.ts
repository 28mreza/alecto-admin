import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { EmptyComponent } from './empty.component'

describe('EmptyComponent', () => {
  let fixture: ComponentFixture<EmptyComponent>

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
      imports: [EmptyComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(EmptyComponent)
    fixture.detectChanges()
  })

  function text(): string {
    return (fixture.nativeElement as HTMLElement).textContent ?? ''
  }

  it('renders the page heading', () => {
    expect(text()).toContain('Empty')
  })

  it('renders basic, dashed and avatar demos', () => {
    const content = text()
    expect(content).toContain('No projects')
    expect(content).toContain('No files uploaded')
    expect(content).toContain('No team members')
    expect(content).toContain('Invite team')
  })
})
