import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { vi } from 'vitest'
import { ToastService } from '../../../core/services/toast.service'
import { DisplayFormComponent } from './display-form.component'

describe('DisplayFormComponent', () => {
  let fixture: ComponentFixture<DisplayFormComponent>
  let toast: { message: ReturnType<typeof vi.fn> }

  beforeEach(async () => {
    toast = { message: vi.fn() }
    await TestBed.configureTestingModule({
      imports: [DisplayFormComponent],
      providers: [{ provide: ToastService, useValue: toast }],
    }).compileComponents()
    fixture = TestBed.createComponent(DisplayFormComponent)
    fixture.detectChanges()
  })

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement
  }

  function component(): DisplayFormComponent {
    return fixture.componentInstance
  }

  function submit(): void {
    const form = host().querySelector('form')
    if (!form) throw new Error('form not found')
    form.dispatchEvent(new Event('submit'))
    fixture.detectChanges()
  }

  it('defaults to recents and home selected', () => {
    expect(component().selectedIds()).toEqual(['recents', 'home'])
  })

  it('renders all six sidebar items', () => {
    const text = host().textContent ?? ''
    for (const label of [
      'Recents',
      'Home',
      'Applications',
      'Desktop',
      'Downloads',
      'Documents',
    ]) {
      expect(text).toContain(label)
    }
  })

  it('requires at least one selected item', () => {
    for (const control of component().selection.controls) {
      control.setValue(false)
    }
    component().selection.markAsTouched()
    fixture.detectChanges()
    expect(component().form.invalid).toBe(true)
    submit()
    expect(host().textContent).toContain(
      'You have to select at least one item.'
    )
    expect(toast.message).not.toHaveBeenCalled()
  })

  it('submits the selected item ids via showSubmittedData', () => {
    submit()
    expect(toast.message).toHaveBeenCalledTimes(1)
    const payload = JSON.parse(toast.message.mock.calls[0][1] as string)
    expect(payload).toEqual({ items: ['recents', 'home'] })
  })
})
