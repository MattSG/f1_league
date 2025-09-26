import { useEffect, useState } from 'react'
import { labelToCountry, labelToShortName, labelToFlag } from '../lib/constants'
import type { TrackSegment } from '../lib/tracks'

type Props = {
  track?: TrackSegment | null
  onRespin?: () => void
}

export default function SelectedTrackCard({ track, onRespin }: Props) {
  const [glow, setGlow] = useState(false)

  useEffect(() => {
    if (!track) {
      setGlow(false)
      return
    }
    setGlow(true)
    const timer = window.setTimeout(() => setGlow(false), 1800)
    return () => window.clearTimeout(timer)
  }, [track?.id])

  if (!track) return null
  const full = track.fullLabel ?? track.label
  const country = labelToCountry(full)
  const short = track.shortLabel ?? labelToShortName(full)
  const flag = labelToFlag(full)

  const cardClass = [
    'fixed top-16 right-6 z-20 max-w-sm px-5 py-5 rounded-xl border backdrop-blur-xl bg-white/10 text-white/90',
    'transform transition-all duration-500 ease-out',
    glow
      ? 'ring-2 ring-red-500/70 shadow-[0_0_36px_rgba(225,6,0,0.45)] scale-[1.04]'
      : 'ring-1 ring-white/12 shadow-[0_0_30px_rgba(0,0,0,0.35)]',
  ].join(' ')

  return (
    <div className={cardClass}>
      <div className="text-[11px] uppercase tracking-[0.32em] text-white/60">Selected Track</div>
      {flag && (
        <div className="mt-2 flex items-center gap-2 text-base text-white/80" aria-label="Country flag">
          <span aria-hidden className="text-lg">
            {flag}
          </span>
          <span>{country}</span>
        </div>
      )}
      <div className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight text-white drop-shadow-sm">{short}</div>
      {!flag && <div className="text-sm text-white/70 mt-2">{country}</div>}
      {onRespin && (
        <button
          className="mt-4 text-sm font-semibold text-red-300 hover:text-red-100 transition-colors"
          onClick={onRespin}
        >
          Respin
        </button>
      )}
    </div>
  )
}
