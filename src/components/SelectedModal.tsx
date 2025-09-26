import { useEffect, useRef } from 'react'
import { labelToCountry, labelToShortName, labelToFlag } from '../lib/constants'

type Props = {
  open: boolean
  track?: { id: string; label: string; fullLabel?: string; shortLabel?: string } | null
  onClose?: () => void
  onChooseWeather?: () => void
  onRespin?: () => void
}

export default function SelectedModal({ open, track, onClose, onChooseWeather, onRespin }: Props) {
  const primaryRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) primaryRef.current?.focus()
  }, [open])

  if (!open || !track) return null
  const full = track.fullLabel ?? track.label
  const country = labelToCountry(full)
  const short = track.shortLabel ?? labelToShortName(full)
  const flag = labelToFlag(full)
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-[min(92vw,640px)] rounded-xl border border-white/10 bg-neutral-900/95 p-6 shadow-2xl">
        <div className="text-sm uppercase text-white/70">Track Selected</div>
        {flag && (
          <div className="mt-2 text-xs text-white/75 flex items-center gap-2" aria-label="Country flag">
            <span aria-hidden>{flag}</span>
          </div>
        )}
        <div className="mt-1 text-2xl md:text-3xl font-bold tracking-tight">{short}</div>
        <div className="text-white/70 mt-1">{country}</div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            ref={primaryRef}
            onClick={onChooseWeather}
            className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            Choose Weather
          </button>
          {onRespin && (
            <button
              onClick={onRespin}
              className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              Spin Again
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="ml-auto px-3 py-2 text-sm rounded bg-transparent text-white/60 hover:text-white/90"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
