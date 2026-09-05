import { Injectable } from '@angular/core'

const STORAGE_PREFIX = 'alecto-admin'

@Injectable({ providedIn: 'root' })
export class StorageService {
  get<T>(key: string): T | null {
    const raw =
      typeof window !== 'undefined'
        ? window.localStorage.getItem(`${STORAGE_PREFIX}:${key}`)
        : null
    if (raw === null) return null
    try {
      return JSON.parse(raw) as T
    } catch {
      return null
    }
  }

  set(key: string, value: unknown): void {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        `${STORAGE_PREFIX}:${key}`,
        JSON.stringify(value)
      )
    }
  }

  remove(key: string): void {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(`${STORAGE_PREFIX}:${key}`)
    }
  }
}
