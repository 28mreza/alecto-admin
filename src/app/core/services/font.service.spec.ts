import { TestBed } from '@angular/core/testing'
import { FontService } from './font.service'

describe('FontService', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.classList.remove(
      'font-jetbrains-mono',
      'font-inter',
      'font-plus-jakarta-sans',
      'font-shantell-sans',
      'font-system'
    )
  })

  it('defaults to plus-jakarta-sans', () => {
    const service = TestBed.inject(FontService)
    expect(service.font()).toBe('plus-jakarta-sans')
  })

  it('setFont applies font class to html element', () => {
    const service = TestBed.inject(FontService)
    service.setFont('inter')
    expect(service.font()).toBe('inter')
    expect(document.documentElement.classList.contains('font-inter')).toBe(true)
    expect(
      document.documentElement.classList.contains('font-jetbrains-mono')
    ).toBe(false)
  })

  it('resetFont restores the default and removes the saved font from storage', () => {
    const service = TestBed.inject(FontService)
    service.setFont('inter')
    service.resetFont()
    expect(service.font()).toBe('plus-jakarta-sans')
    expect(
      document.documentElement.classList.contains('font-plus-jakarta-sans')
    ).toBe(true)
    expect(document.documentElement.classList.contains('font-inter')).toBe(
      false
    )
    expect(window.localStorage.getItem('alecto-admin:font')).toBeNull()
  })

  it('persists the font to storage', () => {
    const service = TestBed.inject(FontService)
    service.setFont('inter')
    expect(window.localStorage.getItem('alecto-admin:font')).toBe(
      '"inter"'
    )
  })

  it('loads a saved font from storage', () => {
    window.localStorage.setItem('alecto-admin:font', '"system"')
    const service = TestBed.inject(FontService)
    expect(service.font()).toBe('system')
  })

  it('falls back to the default for an invalid saved font', () => {
    window.localStorage.setItem(
      'alecto-admin:font',
      '"times-new-roman"'
    )
    const service = TestBed.inject(FontService)
    expect(service.font()).toBe('plus-jakarta-sans')
  })
})
