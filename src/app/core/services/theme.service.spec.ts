import { TestBed } from '@angular/core/testing'
import { vi } from 'vitest'
import { ThemeService } from './theme.service'

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

describe('ThemeService', () => {
  beforeEach(() => {
    mockMatchMedia(true)
    window.localStorage.clear()
    document.documentElement.classList.remove('light', 'dark')
  })

  it('defaults to light', () => {
    const service = TestBed.inject(ThemeService)
    expect(service.theme()).toBe('light')
    expect(service.resolvedTheme()).toBe('light')
  })

  it('setTheme updates the signal', () => {
    const service = TestBed.inject(ThemeService)
    service.setTheme('dark')
    expect(service.theme()).toBe('dark')
    expect(service.resolvedTheme()).toBe('dark')
  })

  it('resetTheme restores default', () => {
    const service = TestBed.inject(ThemeService)
    service.setTheme('dark')
    service.resetTheme()
    expect(service.theme()).toBe('light')
  })

  it('applies the theme class on documentElement', () => {
    const service = TestBed.inject(ThemeService)
    service.setTheme('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.classList.contains('light')).toBe(false)
    service.setTheme('light')
    expect(document.documentElement.classList.contains('light')).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('persists the theme to storage', () => {
    const service = TestBed.inject(ThemeService)
    service.setTheme('dark')
    expect(window.localStorage.getItem('alecto-admin:theme')).toBe(
      '"dark"'
    )
    service.resetTheme()
    expect(window.localStorage.getItem('alecto-admin:theme')).toBeNull()
  })
})
