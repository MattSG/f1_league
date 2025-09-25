import { describe, expect, it } from 'vitest'
import { secureRandomInt, pickRandom } from '../random'

describe('secureRandomInt', () => {
  it('returns integer within range', () => {
    for (let i = 0; i < 100; i++) {
      const n = secureRandomInt(10)
      expect(Number.isInteger(n)).toBe(true)
      expect(n).toBeGreaterThanOrEqual(0)
      expect(n).toBeLessThan(10)
    }
  })

  it('throws on invalid input', () => {
    expect(() => secureRandomInt(0 as any)).toThrow()
  })
})

describe('pickRandom', () => {
  it('picks an element', () => {
    const arr = ['a', 'b', 'c']
    const v = pickRandom(arr)
    expect(arr.includes(v)).toBe(true)
  })
})
