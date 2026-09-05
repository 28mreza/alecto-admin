import { validateUserInvite } from './users-invite-dialog.component'

describe('validateUserInvite', () => {
  it('requires an email', () => {
    expect(
      validateUserInvite({ email: '', role: 'admin', desc: '' }).email
    ).toBe('Please enter an email to invite.')
  })

  it('rejects an invalid email', () => {
    expect(
      validateUserInvite({ email: 'not-an-email', role: 'admin', desc: '' })
        .email
    ).toBeDefined()
  })

  it('requires a role', () => {
    expect(
      validateUserInvite({ email: 'john.doe@gmail.com', role: '', desc: '' })
        .role
    ).toBe('Role is required.')
  })

  it('accepts a valid invite with an optional description', () => {
    expect(
      validateUserInvite({
        email: 'john.doe@gmail.com',
        role: 'admin',
        desc: 'Welcome aboard!',
      })
    ).toEqual({})
    expect(
      validateUserInvite({
        email: 'john.doe@gmail.com',
        role: 'admin',
        desc: '',
      })
    ).toEqual({})
  })
})
