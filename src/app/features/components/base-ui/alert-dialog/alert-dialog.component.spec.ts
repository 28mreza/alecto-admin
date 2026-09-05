import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { AlertDialogComponent } from './alert-dialog.component'

describe('AlertDialogComponent', () => {
  let fixture: ComponentFixture<AlertDialogComponent>

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
      imports: [AlertDialogComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(AlertDialogComponent)
    fixture.detectChanges()
  })

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement
  }

  it('renders the page heading', () => {
    expect(host().textContent).toContain('Alert Dialog')
  })

  it('renders both dialog triggers', () => {
    const buttons = [...host().querySelectorAll('button')].map((b) =>
      b.textContent?.trim()
    )
    expect(buttons).toContain('Show Dialog')
    expect(buttons).toContain('Delete account')
  })
})
