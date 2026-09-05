import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { ThemeService } from '../../core/services/theme.service'
import { LogoComponent } from './logo.component'

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  })
}

describe('LogoComponent', () => {
  let fixture: ComponentFixture<LogoComponent>

  beforeEach(async () => {
    mockMatchMedia(false)
    window.localStorage.clear()
    await TestBed.configureTestingModule({
      imports: [LogoComponent],
      providers: [provideRouter([])],
    }).compileComponents()
    fixture = TestBed.createComponent(LogoComponent)
    fixture.detectChanges()
  })

  function img(): HTMLImageElement {
    return fixture.nativeElement.querySelector('img') as HTMLImageElement
  }

  it('renders the dark artwork by default (visible on the light theme)', () => {
    expect(img().getAttribute('src')).toBe('/images/logo-dark.webp')
    expect(img().getAttribute('alt')).toBe('Shadcn-Admin')
  })

  it('renders the light artwork when the resolved theme is dark', () => {
    TestBed.inject(ThemeService).setTheme('dark')
    fixture.detectChanges()
    expect(img().getAttribute('src')).toBe('/images/logo-light.webp')
  })
})
