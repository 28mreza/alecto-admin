import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { provideRouter } from '@angular/router'
import { vi } from 'vitest'
import { ToastService } from '../../../core/services/toast.service'
import { NotificationsFormComponent } from './notifications-form.component'

describe('NotificationsFormComponent', () => {
  let fixture: ComponentFixture<NotificationsFormComponent>
  let toast: { message: ReturnType<typeof vi.fn> }

  beforeEach(async () => {
    toast = { message: vi.fn() }
    await TestBed.configureTestingModule({
      imports: [NotificationsFormComponent],
      providers: [
        provideRouter([]),
        { provide: ToastService, useValue: toast },
      ],
    }).compileComponents()
    fixture = TestBed.createComponent(NotificationsFormComponent)
    fixture.detectChanges()
  })

  function host(): HTMLElement {
    return fixture.nativeElement as HTMLElement
  }

  function component(): NotificationsFormComponent {
    return fixture.componentInstance
  }

  function submit(): void {
    const form = host().querySelector('form')
    if (!form) throw new Error('form not found')
    form.dispatchEvent(new Event('submit'))
    fixture.detectChanges()
  }

  it('starts with the source defaults', () => {
    const value = component().form.getRawValue()
    expect(value).toMatchObject({
      communication_emails: false,
      marketing_emails: false,
      social_emails: true,
      security_emails: true,
      mobile: false,
    })
    expect(component().form.controls.security_emails.disabled).toBe(true)
  })

  it('renders an hlm-radio-indicator inside every notify-about radio', () => {
    const indicators = host().querySelectorAll('hlm-radio hlm-radio-indicator')
    expect(indicators.length).toBe(3)
  })

  it('requires a notification type before submitting', () => {
    submit()
    expect(host().textContent).toContain('Please select a notification type.')
    expect(toast.message).not.toHaveBeenCalled()
  })

  it('submits the notification preferences via showSubmittedData', () => {
    component().type.setValue('all')
    component().form.controls.mobile.setValue(true)
    submit()
    expect(toast.message).toHaveBeenCalledTimes(1)
    const payload = JSON.parse(toast.message.mock.calls[0][1] as string)
    expect(payload).toMatchObject({
      type: 'all',
      mobile: true,
      communication_emails: false,
      marketing_emails: false,
      social_emails: true,
      security_emails: true,
    })
  })
})
