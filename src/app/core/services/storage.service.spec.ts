import { TestBed } from '@angular/core/testing'
import { StorageService } from './storage.service'

describe('StorageService', () => {
  let service: StorageService

  beforeEach(() => {
    window.localStorage.clear()
    service = TestBed.inject(StorageService)
  })

  it('returns null for a missing key', () => {
    expect(service.get('nope')).toBeNull()
  })

  it('round-trips objects through the prefixed key', () => {
    service.set('prefs', { a: 1 })
    expect(service.get<{ a: number }>('prefs')).toEqual({ a: 1 })
    expect(window.localStorage.getItem('alecto-admin:prefs')).toBe(
      '{"a":1}'
    )
  })

  it('round-trips primitives', () => {
    service.set('theme', 'dark')
    expect(service.get<string>('theme')).toBe('dark')
    service.set('count', 42)
    expect(service.get<number>('count')).toBe(42)
    service.set('flag', true)
    expect(service.get<boolean>('flag')).toBe(true)
  })

  it('returns null for corrupt JSON instead of throwing', () => {
    window.localStorage.setItem('alecto-admin:broken', '{not-json')
    expect(service.get('broken')).toBeNull()
  })

  it('remove deletes the prefixed key', () => {
    service.set('temp', 'x')
    service.remove('temp')
    expect(service.get('temp')).toBeNull()
    expect(window.localStorage.getItem('alecto-admin:temp')).toBeNull()
  })

  it('remove on a missing key does not throw', () => {
    expect(() => service.remove('absent')).not.toThrow()
  })

  it('overwrites an existing value', () => {
    service.set('k', 'one')
    service.set('k', 'two')
    expect(service.get<string>('k')).toBe('two')
  })
})
