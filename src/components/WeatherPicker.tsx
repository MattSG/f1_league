import { useEffect, useRef, useState } from 'react'
import { WEATHER } from '../lib/constants'
import { pickRandom } from '../lib/random'
import TyreReel, { TyreReelHandle } from './TyreReel'

type Result = { name: string; color: string } | null

export default function WeatherPicker() {
  const [results, setResults] = useState<Result[]>([null, null, null])
  const leftRef = useRef<TyreReelHandle>(null)
  const midRef = useRef<TyreReelHandle>(null)
  const rightRef = useRef<TyreReelHandle>(null)

  useEffect(() => {
    // auto-run sequence
    start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function start() {
    setResults([null, null, null])
    const r1 = pickRandom(WEATHER)
    await leftRef.current?.spinTo(r1)
    setResults([r1, null, null])
    const r2 = pickRandom(WEATHER)
    await midRef.current?.spinTo(r2)
    setResults([r1, r2, null])
    const r3 = pickRandom(WEATHER)
    await rightRef.current?.spinTo(r3)
    setResults([r1, r2, r3])
  }

  return (
    <div className="w-full">
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl font-semibold">Weather Choices</h2>
        <p className="text-white/70">Tyres will stop left → right.</p>
      </div>
      <div className="flex items-center justify-center gap-6 flex-wrap">
        <TyreReel ref={leftRef} />
        <TyreReel ref={midRef} />
        <TyreReel ref={rightRef} />
      </div>
      <div className="mt-6 text-center">
        <button onClick={start} className="px-4 py-2 rounded bg-white/10 hover:bg-white/20">
          Reroll Weather
        </button>
      </div>
      <div className="mt-6 text-center text-sm text-white/80">
        {results.every(Boolean) && (
          <div className="inline-flex gap-4 items-center">
            {results.map((r, i) => (
              <div key={i} className="inline-flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: r!.color }} />
                <span>{r!.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
