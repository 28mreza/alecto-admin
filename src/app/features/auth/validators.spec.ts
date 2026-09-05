import {
  validateAuthEmail,
  validateAuthPassword,
  validateConfirmPassword,
  validateOtp,
} from './validators'

describe('validateAuthEmail', () => {
  it('requires an email', () => {
    expect(validateAuthEmail('')).toBe('Please enter your email.')
    expect(validateAuthEmail('   ')).toBe('Please enter your email.')
  })

  it('rejects an invalid email', () => {
    expect(validateAuthEmail('not-an-email')).toBe(
      'Please enter a valid email address.'
    )
    expect(validateAuthEmail('a@b')).toBe('Please enter a valid email address.')
  })

  it('accepts a valid email', () => {
    expect(validateAuthEmail('name@example.com')).toBeNull()
  })
})

describe('validateAuthPassword', () => {
  it('requires a password', () => {
    expect(validateAuthPassword('')).toBe('Please enter your password.')
  })

  it('enforces min length 7', () => {
    expect(validateAuthPassword('123456')).toBe(
      'Password must be at least 7 characters long.'
    )
    expect(validateAuthPassword('1234567')).toBeNull()
  })
})

describe('validateConfirmPassword', () => {
  it('requires a confirmation', () => {
    expect(validateConfirmPassword('1234567', '')).toBe(
      'Please confirm your password.'
    )
  })

  it('flags a mismatch', () => {
    expect(validateConfirmPassword('1234567', 'different')).toBe(
      "Passwords don't match."
    )
    expect(validateConfirmPassword('1234567', '1234567')).toBeNull()
  })
})

describe('validateOtp', () => {
  it('requires exactly 6 chars', () => {
    expect(validateOtp('')).toBe('Please enter the 6-digit code.')
    expect(validateOtp('12345')).toBe('Please enter the 6-digit code.')
    expect(validateOtp('1234567')).toBe('Please enter the 6-digit code.')
    expect(validateOtp('123456')).toBeNull()
  })
})
