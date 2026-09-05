import { TestBed } from '@angular/core/testing'
import { LayoutService } from './layout.service'

describe('LayoutService', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('defaults to icon collapsible, floating variant and full content width', () => {
    const service = TestBed.inject(LayoutService)
    expect(service.collapsible()).toBe('icon')
    expect(service.variant()).toBe('floating')
    expect(service.contentWidth()).toBe('full')
  })

  it('setCollapsible updates the signal and persists', () => {
    const service = TestBed.inject(LayoutService)
    service.setCollapsible('none')
    expect(service.collapsible()).toBe('none')
    expect(
      window.localStorage.getItem('alecto-admin:layout-collapsible')
    ).toBe('"none"')
  })

  it('setVariant updates the signal and persists', () => {
    const service = TestBed.inject(LayoutService)
    service.setVariant('sidebar')
    expect(service.variant()).toBe('sidebar')
    expect(
      window.localStorage.getItem('alecto-admin:layout-variant')
    ).toBe('"sidebar"')
  })

  it('loads saved values from storage', () => {
    window.localStorage.setItem(
      'alecto-admin:layout-collapsible',
      '"offcanvas"'
    )
    window.localStorage.setItem(
      'alecto-admin:layout-variant',
      '"sidebar"'
    )
    const service = TestBed.inject(LayoutService)
    expect(service.collapsible()).toBe('offcanvas')
    expect(service.variant()).toBe('sidebar')
  })

  it('falls back to the default for invalid saved values', () => {
    window.localStorage.setItem(
      'alecto-admin:layout-collapsible',
      '"bogus"'
    )
    window.localStorage.setItem(
      'alecto-admin:layout-variant',
      '"bogus"'
    )
    const service = TestBed.inject(LayoutService)
    expect(service.collapsible()).toBe('icon')
    expect(service.variant()).toBe('floating')
  })

  it('resetLayout restores defaults and removes the saved keys', () => {
    const service = TestBed.inject(LayoutService)
    service.setCollapsible('offcanvas')
    service.setVariant('inset')
    service.setContentWidth('compact')
    service.resetLayout()
    expect(service.collapsible()).toBe('icon')
    expect(service.variant()).toBe('floating')
    expect(service.contentWidth()).toBe('full')
    expect(
      window.localStorage.getItem('alecto-admin:layout-collapsible')
    ).toBeNull()
    expect(
      window.localStorage.getItem('alecto-admin:layout-variant')
    ).toBeNull()
    expect(
      window.localStorage.getItem('alecto-admin:layout-content-width')
    ).toBeNull()
  })

  it('setContentWidth updates the signal and persists', () => {
    const service = TestBed.inject(LayoutService)
    service.setContentWidth('compact')
    expect(service.contentWidth()).toBe('compact')
    expect(
      window.localStorage.getItem(
        'alecto-admin:layout-content-width'
      )
    ).toBe('"compact"')
  })

  it('loads a saved content width from storage', () => {
    window.localStorage.setItem(
      'alecto-admin:layout-content-width',
      '"compact"'
    )
    expect(TestBed.inject(LayoutService).contentWidth()).toBe('compact')
  })

  it('falls back to full for an invalid saved content width', () => {
    window.localStorage.setItem(
      'alecto-admin:layout-content-width',
      '"bogus"'
    )
    expect(TestBed.inject(LayoutService).contentWidth()).toBe('full')
  })
})
