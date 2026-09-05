import { FormControl, FormGroup } from '@angular/forms'
import {
  userPasswordGroupValidator,
  validateUserConfirmPassword,
  validateUserPassword,
} from './users-action-dialog.component'

describe('validateUserPassword', () => {
  it('requires a password on add', () => {
    expect(validateUserPassword('', false)).toBe('Password is required.')
    expect(validateUserPassword('   ', false)).toBe('Password is required.')
  })

  it('enforces min length, lowercase and number on add', () => {
    expect(validateUserPassword('Ab1', false)).toBe(
      'Password must be at least 8 characters long.'
    )
    expect(validateUserPassword('ABCDEFGH1', false)).toBe(
      'Password must contain at least one lowercase letter.'
    )
    expect(validateUserPassword('abcdefgh', false)).toBe(
      'Password must contain at least one number.'
    )
  })

  it('accepts a valid password on add', () => {
    expect(validateUserPassword('s3cur3pass', false)).toBeNull()
  })

  it('skips every rule on edit while the password is empty', () => {
    expect(validateUserPassword('', true)).toBeNull()
    expect(validateUserPassword('   ', true)).toBeNull()
  })

  it('enforces the rules on edit once a password is entered', () => {
    expect(validateUserPassword('short1a', true)).toBe(
      'Password must be at least 8 characters long.'
    )
    expect(validateUserPassword('s3cur3pass', true)).toBeNull()
  })
})

describe('validateUserConfirmPassword', () => {
  it('flags a mismatch on add', () => {
    expect(validateUserConfirmPassword('s3cur3pass', 'different', false)).toBe(
      "Passwords don't match."
    )
    expect(
      validateUserConfirmPassword('s3cur3pass', 's3cur3pass', false)
    ).toBeNull()
  })

  it('skips the match check on edit while the password is empty', () => {
    expect(validateUserConfirmPassword('', '', true)).toBeNull()
    expect(validateUserConfirmPassword('', 'something', true)).toBeNull()
  })

  it('checks the match on edit once a password is entered', () => {
    expect(validateUserConfirmPassword('s3cur3pass', 'other', true)).toBe(
      "Passwords don't match."
    )
  })
})

describe('userPasswordGroupValidator', () => {
  function group(isEdit: boolean, password: string, confirm: string) {
    return new FormGroup(
      {
        password: new FormControl(password),
        confirmPassword: new FormControl(confirm),
        isEdit: new FormControl(isEdit),
      },
      { validators: [userPasswordGroupValidator] }
    )
  }

  it('fails an empty add form with a password error', () => {
    const errors = group(false, '', '').errors
    expect(errors?.['password']).toBe('Password is required.')
  })

  it('passes a valid add form', () => {
    expect(group(false, 's3cur3pass', 's3cur3pass').errors).toBeNull()
  })

  it('passes an untouched edit form', () => {
    expect(group(true, '', '').errors).toBeNull()
  })
})
