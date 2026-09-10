import '@angular/compiler'
import { FormControl } from '@angular/forms'
import { describe, expect, it } from 'vitest'
import { emailValidator, requiredValidator, validateUploadFile } from './registration-validators'

describe('registration validators', () => {
  it('rejects whitespace-only as required', () => {
    expect(requiredValidator(new FormControl('   '))).toEqual({ required: expect.any(String) })
  })
  it('rejects bad email', () => {
    expect(emailValidator(new FormControl('not-an-email'))).toEqual({ email: expect.any(String) })
  })
  it('rejects oversized upload', () => {
    expect(validateUploadFile({ name: 'a.pdf', size: 6 * 1024 * 1024 }, true)).toMatch(/5 ?MB/i)
  })
})
