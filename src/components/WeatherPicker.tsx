import { useRef, useState } from 'react'
import { WEATHER } from '../lib/constants'
import { pickRandom } from '../lib/random'
import TyreReel, { TyreReelHandle } from './TyreReel'

type Result = { name: string; color: string } | null

export default function WeatherPicker() {
  const [results, setResults] = useState<Result[]>([null, null, null])
  const leftRef = useRef<TyreReelHandle>(null)
  const midRef = useRef<TyreReelHandle>(null)
  const rightRef = useRef<TyreReelHandle>(null)

  async function start() {
    setResults([null, null, null])
    const r1 = pickRandom(WEATHER)
    const r2 = pickRandom(WEATHER)
    const r3 = pickRandom(WEATHER)

    const p1 = leftRef.current?.spinTo(r1, { startDelayMs: 0, durationMs: rand(1800, 2300) })
      ?.then(() => setResults((prev) => [r1, prev[1], prev[2]]))
    const p2 = midRef.current?.spinTo(r2, { startDelayMs: 200, durationMs: rand(2400, 3000) })
      ?.then(() => setResults((prev) => [prev[0], r2, prev[2]]))
    const p3 = rightRef.current?.spinTo(r3, { startDelayMs: 400, durationMs: rand(3000, 3600) })
      ?.then(() => setResults((prev) => [prev[0], prev[1], r3]))

    await Promise.all([p1, p2, p3].filter(Boolean) as Promise<void>[])
  }

  function rand(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  return (
    <div className="w-full">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl md:text-4xl font-semibold">Weather Choices</h2>
        <p className="text-white/70 italic">Jeff: “Radar’s clear for now… rain in ten minutes. Probably.”</p>
      </div>
      <div className="flex items-center justify-center gap-10 md:gap-14 flex-wrap">
        <TyreReel ref={leftRef} size={260} />
        <TyreReel ref={midRef} size={260} />
        <TyreReel ref={rightRef} size={260} />
      </div>
      <div className="mt-8 text-center">
        <button onClick={start} className="px-6 py-3 rounded-md bg-white/10 hover:bg-white/20 text-base">
          Reroll Weather
        </button>
      </div>
      <div className="mt-8 text-center text-base md:text-lg text-white/80">
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
