import { Injectable } from '@angular/core'
import { toast } from '@spartan-ng/brain/sonner'

/**
 * Thin wrapper around the Spartan sonner `toast` primitive.
 * Keeps call sites decoupled from the brain package import.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  message(title: string, description?: string): void {
    toast.message(title, description ? { description } : undefined)
  }

  success(title: string, description?: string): void {
    toast.success(title, description ? { description } : undefined)
  }

  error(title: string, description?: string): void {
    toast.error(title, description ? { description } : undefined)
  }

  /**
   * Promise toast mirroring `toast.promise` from the source (`sonner` in the
   * React app). Shows `loading` immediately, then replaces it with the
   * `success` message (or `error` on rejection). The brain sonner primitive
   * already implements this, so this is a thin typed wrapper.
   */
  promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((value: T) => string)
      error: string
    }
  ): void {
    toast.promise(promise, {
      loading: messages.loading,
      success: messages.success as string | ((value: unknown) => string),
      error: messages.error,
    })
  }

  dismiss(id?: string | number): void {
    toast.dismiss(id)
  }
}
