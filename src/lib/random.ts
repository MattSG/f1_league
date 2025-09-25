export function secureRandomInt(maxExclusive: number): number {
  if (maxExclusive <= 0 || !Number.isFinite(maxExclusive)) throw new Error('maxExclusive must be > 0')
  const hasWindow = typeof window !== 'undefined'
  const maybeCrypto: Crypto | undefined = hasWindow ? (window as any).crypto : undefined
  if (maybeCrypto?.getRandomValues) {
    const array = new Uint32Array(1)
    maybeCrypto.getRandomValues(array)
    return array[0] % maxExclusive
  }
  return Math.floor(Math.random() * maxExclusive)
}

export function pickRandom<T>(arr: T[]): T {
  if (!arr.length) throw new Error('Array is empty')
  const idx = secureRandomInt(arr.length)
  return arr[idx]
}

