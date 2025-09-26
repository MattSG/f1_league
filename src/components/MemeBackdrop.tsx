import { useEffect, useMemo, useRef, useState } from 'react'

const QUOTE_SETS = [
  [
    'No Mikey, no! That was so not right!',
    'I am stupid.',
    'Leave me alone, I know what I\'m doing.',
    'I was having a wee.',
    'Gloves and steering wheel! Hurry up!',
    'Fernando is faster than you.',
    "This is not water. It's the drink.",
    'Lick the stamp and send it.',
    "Valtteri, it's James.",
    'Get in there, Lewis!',
    'Box, box, box! Confirm?',
    'My tyres are gone!',
    'Maximum attack now!',
    'Keep drinking, keep drinking.',
    'Tell Seb he can have the trophy.',
    'Is that Glock?!',
    'Plan B. Plan C. Plan D.',
    'We are checking.',
    'Full send, mate.',
    'I have no power!'
  ],
  [
    'Yes mate! Smooth operator! Smooth operator!',
    'Simply lovely, this. Simply lovely.',
    'My engineer is a legend!',
    'To whom it may concern: **** you.',
    "I'm boxing, Michael. This is a joke.",
    'We need more power, we need more power!',
    'Hammer time.',
    'How is the pace? Question.',
    'Leave the radio alone, will you?',
    "I'm out of the race, guys. I'm sorry.",
    'We will need a miracle today.',
    'We did what we had to do.',
    'Can I push now? I want to go flat out.',
    'Tyres are dead. Absolutely gone.',
    "It's not water, mate, it's the drink.",
    'Give me more power!',
    'This guy is a joke.',
    'Tell Toto I said hi.',
    "Mate, I'm giving it everything!",
    "I'm so proud of you guys."
  ],
  [
    'Blue flags! Blue flags!',
    'Strategy, strategy.',
    'We are going to be legendary.',
    'Understood. Copy. Stay off the kerbs.',
    'Yes boys! Mega job!',
    'Mission Winnow complete.',
    "I'm struggling out here!",
    'Safety car, safety car.',
    'Lando, what tyres are you on?',
    'Multi 21, Seb. Multi 21.',
    'Sorry mate, I\'m keeping it.',
    'Tyres are good, Bono.',
    'Magic button! Magic button!',
    "I'm built different.",
    'Push like hell now!',
    'This is still a decent result.',
    'Box opposite.',
    'Lovely stuff.',
    'Simply lovely.',
    'He pushed me off the track!'
  ]
] as const

const TILE_COUNT = 40
const CYCLE_INTERVAL_MS = 20000
const FADE_DURATION_MS = 1300

type QuoteLayer = {
  index: number
  base: number
}

export default function MemeBackdrop() {
  const [current, setCurrent] = useState<QuoteLayer>(() => ({
    index: 0,
    base: Math.floor(Math.random() * QUOTE_SETS[0].length),
  }))
  const [previous, setPrevious] = useState<QuoteLayer | null>(null)
  const [fadeState, setFadeState] = useState<'idle' | 'prep' | 'fading'>('idle')
  const [y, setY] = useState(0)

  const currentRef = useRef(current)
  const rafRef = useRef<number | null>(null)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    const onScroll = () => setY((window.scrollY || 0) * 0.08)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    currentRef.current = current
  }, [current])

  useEffect(() => {
    const tick = () => {
      const nextIndex = (currentRef.current.index + 1) % QUOTE_SETS.length
      const nextBase = Math.floor(Math.random() * QUOTE_SETS[nextIndex].length)
      setPrevious(currentRef.current)
      setCurrent({ index: nextIndex, base: nextBase })
      setFadeState('prep')

      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      rafRef.current = window.requestAnimationFrame(() => setFadeState('fading'))
    }

    intervalRef.current = window.setInterval(tick, CYCLE_INTERVAL_MS)
    return () => {
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  useEffect(() => {
    if (fadeState !== 'fading') return
    const timeout = window.setTimeout(() => {
      setFadeState('idle')
      setPrevious(null)
    }, FADE_DURATION_MS)
    return () => window.clearTimeout(timeout)
  }, [fadeState])

  return (
    <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] via-white/[0.03] to-white/[0.06]" />
      <div className="w-full h-full select-none" style={{ transform: `translate3d(0, ${y}px, 0)` }}>
        <div className="relative w-full h-full">
          {previous && (
            <div
              className={`absolute inset-0 transition-opacity duration-[${FADE_DURATION_MS}ms] ease-out will-change-opacity ${
                fadeState === 'prep' ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Grid quotes={QUOTE_SETS[previous.index]} baseIndex={previous.base} />
            </div>
          )}
          <div
            className={`absolute inset-0 transition-opacity duration-[${FADE_DURATION_MS}ms] ease-out will-change-opacity ${
              fadeState === 'prep' ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <Grid quotes={QUOTE_SETS[current.index]} baseIndex={current.base} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Grid({ quotes, baseIndex }: { quotes: readonly string[]; baseIndex: number }) {
  const items = useMemo(() => Array.from({ length: TILE_COUNT }, (_, i) => i), [])
  return (
    <div className="min-h-full grid grid-cols-3 md:grid-cols-4 auto-rows-[minmax(120px,auto)] gap-10 p-8 pb-24 opacity-60">
      {items.map((i) => (
        <div key={i} className="flex items-center justify-center">
          <div
            className="text-3xl md:text-5xl font-black tracking-tight text-white/15"
            style={{ transform: `rotate(${i % 2 === 0 ? -10 : 8}deg)` }}
          >
            {quotes[(baseIndex + i) % quotes.length]}
          </div>
        </div>
      ))}
    </div>
  )
}
