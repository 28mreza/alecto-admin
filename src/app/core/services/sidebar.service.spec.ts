import { TestBed } from '@angular/core/testing'
import { vi } from 'vitest'
import { SidebarService } from './sidebar.service'

type MediaListener = (event: { matches: boolean }) => void

function mockMatchMedia(matches: boolean) {
  const listeners: MediaListener[] = []
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches,
      media: query,
      addEventListener: vi.fn((_type: string, listener: MediaListener) => {
        listeners.push(listener)
      }),
      removeEventListener: vi.fn(),
    }),
  })
  return listeners
}

describe('SidebarService', () => {
  beforeEach(() => {
    mockMatchMedia(false)
    window.localStorage.clear()
  })

  it('defaults to closed (compact)', () => {
    const service = TestBed.inject(SidebarService)
    expect(service.open()).toBe(false)
  })

  it('setOpen updates the signal and persists', () => {
    const service = TestBed.inject(SidebarService)
    service.setOpen(false)
    expect(service.open()).toBe(false)
    expect(
      window.localStorage.getItem('alecto-admin:sidebar-open')
    ).toBe('false')
  })

  it('toggleOpen flips the open state', () => {
    const service = TestBed.inject(SidebarService)
    service.toggleOpen()
    expect(service.open()).toBe(true)
    service.toggleOpen()
    expect(service.open()).toBe(false)
  })

  it('toggleOpen persists the new value to storage', () => {
    const service = TestBed.inject(SidebarService)
    service.toggleOpen()
    expect(service.open()).toBe(true)
    expect(
      window.localStorage.getItem('alecto-admin:sidebar-open')
    ).toBe('true')
    service.toggleOpen()
    expect(
      window.localStorage.getItem('alecto-admin:sidebar-open')
    ).toBe('false')
  })

  it('loads a saved open state from storage', () => {
    window.localStorage.setItem('alecto-admin:sidebar-open', 'true')
    const service = TestBed.inject(SidebarService)
    expect(service.open()).toBe(true)
  })

  it('isMobile reflects the matchMedia matches value', () => {
    mockMatchMedia(true)
    const service = TestBed.inject(SidebarService)
    expect(service.isMobile()).toBe(true)
  })

  it('updates isMobile when the media query change listener fires', () => {
    const listeners = mockMatchMedia(true)
    const service = TestBed.inject(SidebarService)
    expect(service.isMobile()).toBe(true)
    listeners[0]({ matches: false })
    expect(service.isMobile()).toBe(false)
  })
})
