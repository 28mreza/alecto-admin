import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { AspectRatioComponent } from './aspect-ratio.component'

describe('AspectRatioComponent', () => {
  let fixture: ComponentFixture<AspectRatioComponent>

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
      imports: [AspectRatioComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(AspectRatioComponent)
    fixture.detectChanges()
  })

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement
  }

  it('renders the page heading', () => {
    expect(host().textContent).toContain('Aspect Ratio')
  })

  it('renders landscape, square and portrait images', () => {
    const alts = [...host().querySelectorAll('img')].map((img) =>
      img.getAttribute('alt')
    )
    expect(alts).toEqual(
      expect.arrayContaining([
        'Dashboard preview',
        'Admin thumbnail',
        'Dashboard cover',
      ])
    )
  })
})
