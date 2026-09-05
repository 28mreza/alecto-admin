import { getDisplayNameInitials } from './display-name'

describe('getDisplayNameInitials', () => {
  it('returns the first letters of the first two words', () => {
    expect(getDisplayNameInitials('John Doe')).toBe('JD')
  })

  it('uppercases lowercase names', () => {
    expect(getDisplayNameInitials('jane smith')).toBe('JS')
  })

  it('returns a single initial for a single word', () => {
    expect(getDisplayNameInitials('Madonna')).toBe('M')
  })

  it('ignores extra whitespace and uses only the first two words', () => {
    expect(getDisplayNameInitials('  John   Michael   Doe  ')).toBe('JM')
  })

  it('returns an empty string for an empty or blank name', () => {
    expect(getDisplayNameInitials('')).toBe('')
    expect(getDisplayNameInitials('   ')).toBe('')
  })
})
