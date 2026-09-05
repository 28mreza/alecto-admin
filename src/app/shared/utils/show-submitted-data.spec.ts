import { TestBed } from '@angular/core/testing'
import { vi } from 'vitest'
import { ToastService } from '../../core/services/toast.service'
import { showSubmittedData } from './show-submitted-data'

describe('showSubmittedData', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({})
  })

  it('calls toast.message with the default title and JSON description', () => {
    const service = TestBed.inject(ToastService)
    const spy = vi.spyOn(service, 'message')
    const data = { name: 'John', age: 30 }

    TestBed.runInInjectionContext(() => showSubmittedData(data))

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(
      'You submitted the following values:',
      JSON.stringify(data, null, 2)
    )
  })

  it('uses a custom title when provided', () => {
    const service = TestBed.inject(ToastService)
    const spy = vi.spyOn(service, 'message')
    const data = { role: 'admin' }

    TestBed.runInInjectionContext(() => showSubmittedData(data, 'Saved:'))

    expect(spy).toHaveBeenCalledWith('Saved:', JSON.stringify(data, null, 2))
  })
})
