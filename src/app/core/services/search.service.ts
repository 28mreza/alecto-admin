import { DestroyRef, Injectable, inject, signal } from '@angular/core'

/**
 * Global command-palette open state.
 *
 * Mirrors the React `SearchProvider` (`useSearch`) from the source: a single
 * `open` boolean plus a global Ctrl/Cmd+K shortcut that toggles it.
 */
@Injectable({ providedIn: 'root' })
export class SearchService {
  readonly open = signal(false)

  private readonly destroyRef = inject(DestroyRef)

  constructor() {
    if (typeof document === 'undefined') return
    document.addEventListener('keydown', this.handleKeydown)
    this.destroyRef.onDestroy(() => {
      document.removeEventListener('keydown', this.handleKeydown)
    })
  }

  setOpen(value: boolean): void {
    this.open.set(value)
  }

  toggleOpen(): void {
    this.open.update((open) => !open)
  }

  /**
   * Global keydown handler (Ctrl/Cmd+K toggles the palette).
   * Kept public so unit tests can invoke it directly.
   */
  readonly handleKeydown = (event: KeyboardEvent): void => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault()
      this.toggleOpen()
    }
  }
}
