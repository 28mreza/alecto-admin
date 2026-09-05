import { type ComponentFixture, TestBed } from '@angular/core/testing'
import { Component, type Type } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { provideRouter, Router } from '@angular/router'
import { vi } from 'vitest'
import { ToastService } from '../../core/services/toast.service'
import { ForgotPasswordFormComponent } from './forgot-password/forgot-password-form.component'
import { OtpFormComponent } from './otp/otp-form.component'
import { UserAuthFormComponent } from './sign-in/user-auth-form.component'
import { SignUpFormComponent } from './sign-up/sign-up-form.component'

@Component({ selector: 'app-stub', standalone: true, template: '' })
class StubComponent {}

interface PromiseMessages {
  loading: string
  success: string | ((value: unknown) => string)
  error: string
}

function mockToastService() {
  return {
    message: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    promise: vi.fn((_promise: Promise<unknown>, messages: PromiseMessages) => {
      if (typeof messages.success === 'function') messages.success(undefined)
    }),
  }
}

function setup<T>(component: Type<T>): {
  fixture: ComponentFixture<T>
  router: Router
  toast: ReturnType<typeof mockToastService>
} {
  const toast = mockToastService()
  TestBed.configureTestingModule({
    providers: [
      provideRouter([
        { path: '', component: StubComponent },
        { path: 'otp', component: StubComponent },
        { path: 'tasks', component: StubComponent },
      ]),
      { provide: ToastService, useValue: toast },
    ],
  })
  const fixture = TestBed.createComponent(component)
  const router = TestBed.inject(Router)
  fixture.detectChanges()
  return { fixture, router, toast }
}

interface Exposed {
  form: FormGroup
  onSubmit: () => void
  redirectTo?: unknown
}

function exposed<T>(fixture: ComponentFixture<T>): Exposed {
  return fixture.componentInstance as unknown as Exposed
}

describe('UserAuthFormComponent', () => {
  it('renders the email, password, forgot link and social buttons', () => {
    const { fixture } = setup(UserAuthFormComponent)
    const el: HTMLElement = fixture.nativeElement
    expect(el.querySelector('#sign-in-email')).not.toBeNull()
    expect(el.querySelector('app-password-input')).not.toBeNull()
    expect(el.textContent).toContain('Forgot password?')
    expect(el.textContent).toContain('Or continue with')
    expect(el.textContent).toContain('GitHub')
    expect(el.textContent).toContain('Facebook')
  })

  it('blocks submit while invalid without toast or navigation', () => {
    const { fixture, router, toast } = setup(UserAuthFormComponent)
    const navigate = vi.spyOn(router, 'navigateByUrl')
    exposed(fixture).onSubmit()
    fixture.detectChanges()

    expect(exposed(fixture).form.invalid).toBe(true)
    expect(toast.promise).not.toHaveBeenCalled()
    expect(navigate).not.toHaveBeenCalled()
  })

  it('shows the email message for an invalid address', () => {
    const { fixture } = setup(UserAuthFormComponent)
    const form = exposed(fixture).form
    form.controls['email'].setValue('not-an-email')
    form.controls['email'].markAsTouched()
    fixture.detectChanges()

    expect(fixture.nativeElement.textContent).toContain(
      'Please enter a valid email address.'
    )
  })

  it('signs in and navigates to / on success', () => {
    const { fixture, router, toast } = setup(UserAuthFormComponent)
    const navigate = vi.spyOn(router, 'navigateByUrl')
    exposed(fixture).form.setValue({
      email: 'name@example.com',
      password: '1234567',
    })
    exposed(fixture).onSubmit()

    expect(toast.promise).toHaveBeenCalledOnce()
    expect(toast.promise.mock.calls[0][1].loading).toBe('Signing in...')
    expect(navigate).toHaveBeenCalledWith('/')
  })

  it('navigates to the redirect target when provided', () => {
    const { fixture, router } = setup(UserAuthFormComponent)
    fixture.componentRef.setInput('redirectTo', '/tasks')
    const navigate = vi.spyOn(router, 'navigateByUrl')
    exposed(fixture).form.setValue({
      email: 'name@example.com',
      password: '1234567',
    })
    exposed(fixture).onSubmit()

    expect(navigate).toHaveBeenCalledWith('/tasks')
  })
})

describe('SignUpFormComponent', () => {
  it('flags a confirm-password mismatch', () => {
    const { fixture, toast } = setup(SignUpFormComponent)
    const form = exposed(fixture).form
    form.setValue({
      email: 'name@example.com',
      password: '1234567',
      confirmPassword: 'different',
    })
    exposed(fixture).onSubmit()
    fixture.detectChanges()

    expect(form.invalid).toBe(true)
    expect(form.errors?.['confirmPassword']).toBe("Passwords don't match.")
    expect(fixture.nativeElement.textContent).toContain(
      "Passwords don't match."
    )
    expect(toast.promise).not.toHaveBeenCalled()
  })

  it('creates an account and toasts on success', () => {
    const { fixture, toast } = setup(SignUpFormComponent)
    exposed(fixture).form.setValue({
      email: 'name@example.com',
      password: '1234567',
      confirmPassword: '1234567',
    })
    exposed(fixture).onSubmit()

    expect(toast.promise).toHaveBeenCalledOnce()
    expect(toast.promise.mock.calls[0][1].loading).toBe('Creating account...')
  })
})

describe('ForgotPasswordFormComponent', () => {
  it('blocks submit while the email is invalid', () => {
    const { fixture, router, toast } = setup(ForgotPasswordFormComponent)
    const navigate = vi.spyOn(router, 'navigate')
    exposed(fixture).onSubmit()

    expect(exposed(fixture).form.invalid).toBe(true)
    expect(toast.promise).not.toHaveBeenCalled()
    expect(navigate).not.toHaveBeenCalled()
  })

  it('sends the email, resets and navigates to /otp', () => {
    const { fixture, router, toast } = setup(ForgotPasswordFormComponent)
    const navigate = vi.spyOn(router, 'navigate')
    exposed(fixture).form.setValue({ email: 'name@example.com' })
    exposed(fixture).onSubmit()

    expect(toast.promise).toHaveBeenCalledOnce()
    expect(toast.promise.mock.calls[0][1].loading).toBe('Sending email...')
    expect(navigate).toHaveBeenCalledWith(['/otp'])
  })
})

describe('OtpFormComponent', () => {
  it('keeps Verify disabled until 6 chars are entered', () => {
    const { fixture } = setup(OtpFormComponent)
    const button = (): HTMLButtonElement =>
      fixture.nativeElement.querySelector('button[type="submit"]')
    const form = exposed(fixture).form

    expect(button().disabled).toBe(true)

    form.controls['otp'].setValue('12345')
    fixture.detectChanges()
    expect(button().disabled).toBe(true)

    form.controls['otp'].setValue('123456')
    fixture.detectChanges()
    expect(button().disabled).toBe(false)
  })

  it('verifies and navigates to / after the delay', () => {
    vi.useFakeTimers()
    try {
      const { fixture, router } = setup(OtpFormComponent)
      const navigate = vi.spyOn(router, 'navigate')
      exposed(fixture).form.setValue({ otp: '123456' })
      exposed(fixture).onSubmit()

      expect(navigate).not.toHaveBeenCalled()
      vi.advanceTimersByTime(1000)
      expect(navigate).toHaveBeenCalledWith(['/'])
    } finally {
      vi.useRealTimers()
    }
  })
})
