export function secureRandomInt(maxExclusive: number): number {
  if (!Number.isFinite(maxExclusive) || maxExclusive <= 0) {
    throw new Error('maxExclusive must be > 0')
  }
  const hasWindow = typeof window !== 'undefined'
  const maybeCrypto: Crypto | undefined = hasWindow ? (window as any).crypto : undefined
  // Use rejection sampling to avoid modulo bias, especially for small ranges
  if (maybeCrypto?.getRandomValues) {
    const maxUint = 0xffffffff
    const bucketSize = Math.floor((maxUint + 1) / maxExclusive)
    const limit = bucketSize * maxExclusive
    const buf = new Uint32Array(1)
    while (true) {
      maybeCrypto.getRandomValues(buf)
      const x = buf[0]
      if (x < limit) return Math.floor(x / bucketSize)
    }
  }
  // Fallback to Math.random()
  return Math.floor(Math.random() * maxExclusive)
}

export function pickRandom<T>(arr: T[]): T {
  if (!arr.length) throw new Error('Array is empty')
  const idx = secureRandomInt(arr.length)
  return arr[idx]
}

/**
 * Shuffle a copy of an array using a secure RNG when available.
 */
export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1)
    const t = a[i]; a[i] = a[j]; a[j] = t
  }
  return a
}
