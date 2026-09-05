import { AbstractControl, ValidationErrors } from '@angular/forms'

/**
 * Shared auth-form validators.
 *
 * Pure helpers mirroring the zod messages of the source
 * (`shadcn-admin/src/features/auth/**`) so they stay unit-testable without
 * TestBed. Each component wires them into Reactive Forms through the
 * `*Validator` adaptors below (the error payload carries the exact message
 * to render, following the `userPasswordGroupValidator` pattern).
 */
export const AUTH_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateAuthEmail(value: string): string | null {
  const trimmed = (value ?? '').trim()
  if (!trimmed) return 'Please enter your email.'
  if (!AUTH_EMAIL_PATTERN.test(trimmed)) {
    return 'Please enter a valid email address.'
  }
  return null
}

export function validateAuthPassword(value: string): string | null {
  const current = value ?? ''
  if (!current) return 'Please enter your password.'
  if (current.length < 7) {
    return 'Password must be at least 7 characters long.'
  }
  return null
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string
): string | null {
  if (!(confirmPassword ?? '')) return 'Please confirm your password.'
  if (password !== confirmPassword) return "Passwords don't match."
  return null
}

export function validateOtp(value: string): string | null {
  if ((value ?? '').length !== 6) return 'Please enter the 6-digit code.'
  return null
}

/** Control-level adaptor for the email field. */
export function authEmailValidator(
  control: AbstractControl
): ValidationErrors | null {
  const error = validateAuthEmail(String(control.value ?? ''))
  return error ? { authEmail: error } : null
}

/** Control-level adaptor for the password field. */
export function authPasswordValidator(
  control: AbstractControl
): ValidationErrors | null {
  const error = validateAuthPassword(String(control.value ?? ''))
  return error ? { authPassword: error } : null
}

/** Group-level validator wiring the confirm-password match rule. */
export function signUpGroupValidator(
  group: AbstractControl
): ValidationErrors | null {
  const password = String(group.get('password')?.value ?? '')
  const confirmPassword = String(group.get('confirmPassword')?.value ?? '')
  const error = validateConfirmPassword(password, confirmPassword)
  return error ? { confirmPassword: error } : null
}

/** Control-level adaptor for the OTP field. */
export function otpLengthValidator(
  control: AbstractControl
): ValidationErrors | null {
  const error = validateOtp(String(control.value ?? ''))
  return error ? { otp: error } : null
}
