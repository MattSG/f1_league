import { labelToCountry, labelToShortName, labelToFlag } from '../lib/constants'

type Props = {
  track?: { id: string; label: string } | null
  onRespin?: () => void
}

export default function SelectedTrackCard({ track, onRespin }: Props) {
  if (!track) return null
  const full = (track as any).fullLabel ?? track.label
  const country = labelToCountry(full)
  const short = labelToShortName(full)
  const flag = labelToFlag(full)
  return (
    <div className="fixed top-20 right-4 z-20 bg-white/5 backdrop-blur rounded-lg border border-white/10 p-4 max-w-xs">
      <div className="text-xs uppercase opacity-70">Selected Track</div>
      {flag && (
        <div className="mt-1 text-xs text-white/75 flex items-center gap-1" aria-label="Country flag">
          <span aria-hidden>{flag}</span>
        </div>
      )}
      <div className="mt-1 text-lg md:text-xl font-semibold leading-snug">{short}</div>
      <div className="text-xs text-white/75 mt-1">{country}</div>
      {onRespin && (
        <button className="mt-3 text-sm text-red-300 hover:text-red-200 underline" onClick={onRespin}>
          Respin
        </button>
      )}
    </div>
  )
}
