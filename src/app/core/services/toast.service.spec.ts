import { TestBed } from '@angular/core/testing'
import { toast, toastState } from '@spartan-ng/brain/sonner'
import { ToastService } from './toast.service'

describe('ToastService', () => {
  let service: ToastService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(ToastService)
    toast.dismiss()
  })

  afterEach(() => {
    toast.dismiss()
  })

  it('creates a message toast with title and description', () => {
    service.message('Hello', 'World')

    const toasts = toastState.toasts()
    expect(toasts.length).toBe(1)
    expect(toasts[0].title).toBe('Hello')
    expect(toasts[0].description).toBe('World')
    expect(toasts[0].type).toBe('default')
  })

  it('creates a success toast', () => {
    service.success('Saved')

    const toasts = toastState.toasts()
    expect(toasts.length).toBe(1)
    expect(toasts[0].title).toBe('Saved')
    expect(toasts[0].type).toBe('success')
  })

  it('creates an error toast', () => {
    service.error('Failed', 'Something went wrong')

    const toasts = toastState.toasts()
    expect(toasts.length).toBe(1)
    expect(toasts[0].title).toBe('Failed')
    expect(toasts[0].description).toBe('Something went wrong')
    expect(toasts[0].type).toBe('error')
  })
})
