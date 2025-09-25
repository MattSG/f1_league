import { describe, expect, it } from 'vitest'
import { easeOutCubic } from '../easing'

describe('easeOutCubic', () => {
  it('clamps and maps endpoints', () => {
    expect(easeOutCubic(0)).toBeCloseTo(0)
    expect(easeOutCubic(1)).toBeCloseTo(1)
    expect(easeOutCubic(-1)).toBeCloseTo(0)
    expect(easeOutCubic(2)).toBeCloseTo(1)
  })

  it('has expected mid value', () => {
    // 1 - (1 - 0.5)^3 = 0.875
    expect(easeOutCubic(0.5)).toBeCloseTo(0.875, 4)
  })
})

