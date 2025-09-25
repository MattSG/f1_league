type Props = {
  track?: { id: string; label: string } | null
  onRespin?: () => void
}

export default function SelectedTrackCard({ track, onRespin }: Props) {
  if (!track) return null
  return (
    <div className="fixed top-20 right-4 z-20 bg-white/5 backdrop-blur rounded-lg border border-white/10 p-4 max-w-xs">
      <div className="text-xs uppercase opacity-70">Selected Track</div>
      <div className="font-semibold leading-snug">{track.label}</div>
      {onRespin && (
        <button className="mt-3 text-sm text-red-300 hover:text-red-200 underline" onClick={onRespin}>
          Respin
        </button>
      )}
    </div>
  )
}

