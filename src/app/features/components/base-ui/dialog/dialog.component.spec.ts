import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { DialogComponent } from './dialog.component'

describe('DialogComponent', () => {
  let fixture: ComponentFixture<DialogComponent>

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
      imports: [DialogComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(DialogComponent)
    fixture.detectChanges()
  })

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement
  }

  it('renders the page heading', () => {
    expect(host().textContent).toContain('Dialog')
  })

  it('renders both dialog triggers', () => {
    const buttons = [...host().querySelectorAll('button')].map((b) =>
      b.textContent?.trim()
    )
    expect(buttons).toContain('Edit profile')
    expect(buttons).toContain('Share')
  })
})
