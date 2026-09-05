import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { DrawerComponent } from './drawer.component'

describe('DrawerComponent', () => {
  let fixture: ComponentFixture<DrawerComponent>

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
      imports: [DrawerComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(DrawerComponent)
    fixture.detectChanges()
  })

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement
  }

  it('renders the page heading', () => {
    expect(host().textContent).toContain('Drawer')
  })

  it('renders both drawer triggers', () => {
    const buttons = [...host().querySelectorAll('button')].map((b) =>
      b.textContent?.trim()
    )
    expect(buttons).toContain('Open Drawer')
    expect(buttons).toContain('Open Right Drawer')
  })
})
