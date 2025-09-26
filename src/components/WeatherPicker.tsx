import { useMemo, useRef, useState } from 'react'
import { WEATHER } from '../lib/constants'
import { shuffle } from '../lib/random'
import TyreReel, { TyreReelHandle } from './TyreReel'

type Result = { name: string; color: string } | null

const WHEEL_COUNT = 3 as const
const SPIN_DELAYS = [0, 360, 720]

export default function WeatherPicker() {
  const [results, setResults] = useState<Result[]>(Array(WHEEL_COUNT).fill(null))
  const leftRef = useRef<TyreReelHandle>(null)
  const midRef = useRef<TyreReelHandle>(null)
  const rightRef = useRef<TyreReelHandle>(null)
  const reelRefs = [leftRef, midRef, rightRef]

  async function start() {
    setResults(Array(WHEEL_COUNT).fill(null))
    const picks = buildWeatherSet()

    const spins = picks.map((weather, index) => {
      const ref = reelRefs[index].current
      const duration = rand(1800 + index * 400, 2400 + index * 400)
      return ref
        ?.spinTo(weather, { startDelayMs: SPIN_DELAYS[index] ?? index * 360, durationMs: duration })
        ?.then(() =>
          setResults((prev) => {
            const next = [...prev]
            next[index] = weather
            return next
          }),
        )
    })

    await Promise.all(spins.filter(Boolean) as Promise<void>[])
  }

  function buildWeatherSet() {
    const dry = WEATHER.find((w) => w.name === 'Dry')!
    const wetPool = WEATHER.filter((w) => w.name !== 'Dry')
    const picks = [dry, pickOne(wetPool), pickOne(WEATHER)]
    return shuffle(picks)
  }

  function pickOne<T>(list: readonly T[]): T {
    return list[Math.floor(Math.random() * list.length)]
  }

  function rand(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const quote = useMemo(() => {
    if (!results.every(Boolean)) {
      return 'Jeff: "We’ll see what we get. Keep the engine running."'
    }
    const names = results.map((r) => r!.name)
    if (names.includes('Very Wet')) {
      return 'Jeff: "Full wets ready. Brake earlier and watch for standing water."'
    }
    if (names.includes('Wet')) {
      return 'Jeff: "Inters seem best. Expect it to be slippery through the middle sector."'
    }
    return 'Jeff: "Track looks bone dry. Box for slicks and push when you can."'
  }, [results])

  return (
    <div className="w-full">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl md:text-4xl font-semibold">Weather Choices</h2>
        <p className="text-white/70 italic">{quote}</p>
      </div>
      <div className="flex items-center justify-center gap-10 md:gap-14 flex-wrap">
        {reelRefs.map((ref, index) => (
          <TyreReel key={index} ref={ref} size={260} />
        ))}
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
