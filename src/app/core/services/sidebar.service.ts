import { Injectable, inject, signal } from '@angular/core'
import { StorageService } from './storage.service'

const SIDEBAR_OPEN_KEY = 'sidebar-open'
const MOBILE_QUERY = '(max-width: 767px)'

@Injectable({ providedIn: 'root' })
export class SidebarService {
  readonly defaultOpen = false
  readonly open = signal(this.defaultOpen)
  readonly isMobile = signal(false)
  readonly mobileOpen = signal(false)

  private readonly storage = inject(StorageService)

  constructor() {
    const saved = this.storage.get<boolean>(SIDEBAR_OPEN_KEY)
    if (saved !== null && typeof saved === 'boolean') {
      this.open.set(saved)
    }

    const query = window.matchMedia(MOBILE_QUERY)
    this.isMobile.set(query.matches)
    query.addEventListener('change', (event) =>
      this.isMobile.set(event.matches)
    )
  }

  setOpen(open: boolean): void {
    this.open.set(open)
    this.storage.set(SIDEBAR_OPEN_KEY, open)
  }

  toggleOpen(): void {
    const next = !this.open()
    this.open.set(next)
    this.storage.set(SIDEBAR_OPEN_KEY, next)
  }

  setMobileOpen(open: boolean): void {
    this.mobileOpen.set(open)
  }

  toggleMobileOpen(): void {
    this.mobileOpen.update((value) => !value)
  }
}
