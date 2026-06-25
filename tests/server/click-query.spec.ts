import { describe, expect, it } from 'vitest'

import { buildClickWhere } from '../../server/utils/click-query'

describe('buildClickWhere', () => {
  it('builds a valid bot-filtered where clause without user filters', () => {
    const result = buildClickWhere({})

    expect(result.where).toBe('WHERE is_bot = 0')
    expect(result.params).toEqual([])
  })

  it('appends bot filter after user filters', () => {
    const result = buildClickWhere({ slug: 'abc', country: 'ID' })

    expect(result.where).toBe('WHERE slug = ? AND country = ? AND is_bot = 0')
    expect(result.params).toEqual(['abc', 'ID'])
  })
})
