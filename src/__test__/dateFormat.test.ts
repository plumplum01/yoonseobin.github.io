import { describe, expect, it } from 'vitest'
import { formatKoDate } from '../lib/dateFormat'

describe('formatKoDate', () => {
  it('formats medium Korean dates', () => {
    expect(formatKoDate('2026-06-01T12:00:00.000Z', 'medium')).toBe('2026. 6. 1.')
  })

  it('formats long Korean dates', () => {
    expect(formatKoDate('2026-06-01T12:00:00.000Z', 'long')).toBe('2026년 6월 1일')
  })
})
