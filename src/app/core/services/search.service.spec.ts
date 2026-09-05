import { TestBed } from '@angular/core/testing'
import { SearchService } from './search.service'

function keydown(init: KeyboardEventInit): KeyboardEvent {
  return new KeyboardEvent('keydown', init)
}

describe('SearchService', () => {
  let service: SearchService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(SearchService)
    service.setOpen(false)
  })

  it('starts closed', () => {
    expect(service.open()).toBe(false)
  })

  it('setOpen updates the open state', () => {
    service.setOpen(true)
    expect(service.open()).toBe(true)
    service.setOpen(false)
    expect(service.open()).toBe(false)
  })

  it('toggleOpen flips the open state', () => {
    service.toggleOpen()
    expect(service.open()).toBe(true)
    service.toggleOpen()
    expect(service.open()).toBe(false)
  })

  it('handleKeydown toggles on Ctrl+K and prevents default', () => {
    const event = keydown({ key: 'k', ctrlKey: true })
    const preventDefault = vi.spyOn(event, 'preventDefault')
    service.handleKeydown(event)
    expect(service.open()).toBe(true)
    expect(preventDefault).toHaveBeenCalled()
  })

  it('handleKeydown toggles on Cmd+K (metaKey)', () => {
    const event = keydown({ key: 'K', metaKey: true })
    service.handleKeydown(event)
    expect(service.open()).toBe(true)
    service.handleKeydown(event)
    expect(service.open()).toBe(false)
  })

  it('handleKeydown ignores a plain K press', () => {
    service.handleKeydown(keydown({ key: 'k' }))
    expect(service.open()).toBe(false)
  })

  it('handleKeydown ignores Ctrl pressed with other keys', () => {
    service.handleKeydown(keydown({ key: 'p', ctrlKey: true }))
    expect(service.open()).toBe(false)
  })

  it('toggles via a real document keydown event', () => {
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', ctrlKey: true })
    )
    expect(service.open()).toBe(true)
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', ctrlKey: true })
    )
    expect(service.open()).toBe(false)
  })
})
