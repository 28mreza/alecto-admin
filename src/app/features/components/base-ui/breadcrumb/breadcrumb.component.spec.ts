import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { BreadcrumbComponent } from './breadcrumb.component'

describe('BreadcrumbComponent', () => {
  let fixture: ComponentFixture<BreadcrumbComponent>

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
      imports: [BreadcrumbComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(BreadcrumbComponent)
    fixture.detectChanges()
  })

  function text(): string {
    return (fixture.nativeElement as HTMLElement).textContent ?? ''
  }

  it('renders the page heading', () => {
    expect(text()).toContain('Breadcrumb')
  })

  it('renders basic, collapsed and custom-separator trails', () => {
    const content = text()
    expect(content).toContain('Home')
    expect(content).toContain('Components')
    expect(content).toContain('More')
    expect(content).toContain('Separator')
  })
})
