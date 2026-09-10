import { AbstractControl, ValidationErrors } from '@angular/forms'
import { ALLOWED_UPLOAD_EXTS, MAX_UPLOAD_BYTES } from './registration-options'
export function validateRequired(v: unknown): string | null {
  return String(v ?? '').trim() ? null : 'This field is required.'
}
export function validateEmail(v: unknown): string | null {
  const t = String(v ?? '').trim()
  if (!t) return 'Email is required.'
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t) ? null : 'Enter a valid email address.'
}
export function validatePhone(v: unknown): string | null {
  const t = String(v ?? '').trim()
  if (!t) return 'Phone number is required.'
  return /^[0-9+\-\s()]{5,20}$/.test(t) ? null : 'Enter a valid phone number.'
}
export function validateConfirmPassword(pw: string, c: string): string | null {
  if (!String(c ?? '')) return 'Please confirm your password.'
  return pw === c ? null : "Passwords don't match."
}
export function validateUploadFile(f: { name: string; size: number } | null, required: boolean): string | null {
  if (!f) return required ? 'File is required.' : null
  const ext = f.name.split('.').pop()?.toLowerCase() ?? ''
  if (!ALLOWED_UPLOAD_EXTS.includes(ext)) return 'Allowed formats: JPG, PNG, PDF.'
  if (f.size > MAX_UPLOAD_BYTES) return 'Maximum file size is 5 MB.'
  return null
}
export function requiredValidator(c: AbstractControl): ValidationErrors | null {
  const e = validateRequired(c.value); return e ? { required: e } : null
}
export function emailValidator(c: AbstractControl): ValidationErrors | null {
  const e = validateEmail(c.value); return e ? { email: e } : null
}
export function phoneValidator(c: AbstractControl): ValidationErrors | null {
  const e = validatePhone(c.value); return e ? { phone: e } : null
}
export function uploadValidator(required: boolean) {
  return (c: AbstractControl): ValidationErrors | null => {
    const e = validateUploadFile(c.value as { name: string; size: number } | null, required)
    return e ? { upload: e } : null
  }
}
export function passwordMatchGroupValidator(g: AbstractControl): ValidationErrors | null {
  const pw = String(g.get('password')?.value ?? '')
  const e = validateConfirmPassword(pw, String(g.get('confirmPassword')?.value ?? ''))
  return e ? { confirmPassword: e } : null
}
