import { useEffect, useMemo, useState } from 'react'

const DEFAULT_QUOTES = [
  'No Mikey, no!',
  'I am stupid.',
  'Box, box.',
  'Leave me alone, I know what I’m doing.',
  'It’s hammer time.',
  'Blue flags! Blue flags!',
  'Valtteri, it’s James.',
  'We are checking.',
  'GP2 engine! GP2!',
  'Defend like a lion!',
  'Plan A. Plan B.',
  'My tyres are gone!',
  'The tyres are dead.',
  'Strategy, strategy.',
  'Box opposite',
  'Is that Glock?',
]

export default function MemeBackdrop() {
  const quotes = useMemo(() => DEFAULT_QUOTES, [])

  const [y, setY] = useState(0)
  useEffect(() => {
    const onScroll = () => setY((window.scrollY || 0) * 0.08)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const tiles = new Array(40).fill(0).map((_, i) => i)
  return (
    <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] via-white/[0.03] to-white/[0.06]" />
      <div className="w-full h-full select-none" style={{ transform: `translate3d(0, ${y}px, 0)` }}>
        <Grid quotes={quotes} baseIndex={0} />
      </div>
    </div>
  )
}

function Grid({ quotes, baseIndex }: { quotes: string[]; baseIndex: number }) {
  const items = new Array(40).fill(0).map((_, i) => (
    <div key={i} className="flex items-center justify-center">
      <div
        className="text-3xl md:text-5xl font-black tracking-tight text-white/15"
        style={{ transform: `rotate(${(i % 2 === 0 ? -10 : 8)}deg)` }}
      >
        {quotes[(baseIndex + i) % quotes.length]}
      </div>
    </div>
  ))
  return <div className="min-h-full grid grid-cols-3 md:grid-cols-4 auto-rows-[minmax(120px,auto)] gap-10 p-8 pb-24 opacity-60">{items}</div>
}
