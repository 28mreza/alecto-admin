import { describe, expect, it } from 'vitest'
import { BANKS, CURRENCIES, DATA_CATEGORIES, PROFILE_TYPES, RECIPIENT_TYPES } from './registration-options'

describe('registration options', () => {
  it.each([
    ['profile types', PROFILE_TYPES],
    ['data categories', DATA_CATEGORIES],
    ['banks', BANKS],
    ['currencies', CURRENCIES],
    ['recipient types', RECIPIENT_TYPES],
  ])('provides 50 %s with unique values', (_label, options) => {
    expect(options).toHaveLength(50)
    expect(new Set(options.map((o) => o.value)).size).toBe(50)
  })
})
