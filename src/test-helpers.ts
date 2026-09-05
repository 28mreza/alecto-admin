import { vi } from 'vitest'

/**
 * Shared test helpers for the Vitest suite.
 *
 * The `@angular/build:unit-test` builder does not expose a `setupFiles`
 * option, so global jsdom shims cannot be registered centrally without a
 * custom `runnerConfig`. These helpers are imported by the specs that need
 * them instead (kept behaviour-identical to the historical per-spec stubs).
 */

/** Stubs `window.matchMedia` with a fixed `matches` value. */
export function mockMatchMedia(matches: boolean): void {
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

/**
 * Installs a `scrollIntoView` no-op on `Element.prototype` when jsdom does
 * not provide one (CDK key-manager / overlay focus handling calls it).
 * Idempotent: safe to call from every spec's `beforeEach`.
 */
export function ensureScrollIntoViewStub(): void {
  if (!Element.prototype.scrollIntoView) {
    Object.defineProperty(Element.prototype, 'scrollIntoView', {
      value: vi.fn(),
      configurable: true,
      writable: true,
    })
  }
}

/**
 * Installs a minimal `ResizeObserver` stub when jsdom does not provide one
 * (spartan brain dimension tracking reads it in `afterRender`).
 * Idempotent: safe to call from every spec's `beforeEach`.
 */
export function ensureResizeObserverStub(): void {
  if (!window.ResizeObserver) {
    Object.defineProperty(window, 'ResizeObserver', {
      value: vi.fn().mockImplementation(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      })),
      configurable: true,
      writable: true,
    })
  }
}
