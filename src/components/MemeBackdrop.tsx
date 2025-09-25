import { useEffect, useMemo, useState } from 'react'

const DEFAULT_QUOTES = [
  'Box, box.',
  'We are checking.',
  'Plan A. Plan B. Plan C.',
  'My tyres are gone!',
  'Leave me alone, I know what I’m doing.',
  'Is that Glock?',
  'It’s hammer time.',
  'Porpoising? Never heard of her.',
  'Blue flags, blue flags.',
  'For sure.',
  'He pushed me off! He pushed me off!',
  'Valtteri, it’s James.',
  'We’ll talk after the race.',
  'Tyre deg is massive.',
  'Box opposite',
  'Charles, head down.',
  'Fernando is faster than you.',
]

export default function MemeBackdrop() {
  const [index, setIndex] = useState(0)
  const quotes = useMemo(() => DEFAULT_QUOTES, [])

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % quotes.length), 3500)
    return () => clearInterval(id)
  }, [quotes.length])

  const [y, setY] = useState(0)
  useEffect(() => {
    const onScroll = () => setY((window.scrollY || 0) * 0.08)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const tiles = new Array(40).fill(0).map((_, i) => i)
  const nextIndex = (index + 1) % quotes.length
  return (
    <div className="fixed inset-0 overflow-hidden z-0 pointer-events-none" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] via-white/[0.03] to-white/[0.06]" />
      <div className="w-full h-full select-none" style={{ transform: `translate3d(0, ${y}px, 0)` }}>
        {/* Crossfade layers */}
        <div className="absolute inset-0 opacity-0 animate-[fadeQuote_3.5s_linear_infinite]">
          <Grid quotes={quotes} baseIndex={index} />
        </div>
        <div className="absolute inset-0 opacity-100 animate-[fadeQuote2_3.5s_linear_infinite]">
          <Grid quotes={quotes} baseIndex={nextIndex} />
        </div>
      </div>
      <style>{`
        @keyframes fadeQuote { 0%{opacity:1} 45%{opacity:1} 60%{opacity:0} 100%{opacity:0} }
        @keyframes fadeQuote2 { 0%{opacity:0} 45%{opacity:0} 60%{opacity:1} 100%{opacity:1} }
      `}</style>
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
