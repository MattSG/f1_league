import MemeBackdrop from '../components/MemeBackdrop'
import WeatherPicker from '../components/WeatherPicker'
import { useEffect, useState } from 'react'
import { labelToCountry, labelToFlag } from '../lib/constants'
import { parseStoredTrack, SELECTED_TRACK_STORAGE_KEY } from '../lib/tracks'
import type { TrackSegment } from '../lib/tracks'

export default function Weather() {
  const [segment, setSegment] = useState<TrackSegment | null>(null)

  useEffect(() => {
    const stored = parseStoredTrack(localStorage.getItem(SELECTED_TRACK_STORAGE_KEY))
    if (stored) setSegment(stored)
  }, [])

  const trackLabel = segment?.shortLabel ?? null
  const metadataBasis = segment?.fullLabel ?? segment?.label ?? ''
  const flag = metadataBasis ? labelToFlag(metadataBasis) : ''
  const country = metadataBasis ? labelToCountry(metadataBasis) : ''

  return (
    <main className="relative">
      <MemeBackdrop />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12">
        <div className="text-center mb-4">
          {trackLabel && (
            <div className="inline-flex flex-col items-center px-4 py-2 rounded-md bg-white/10 border border-white/10 text-white/85">
              <div className="text-sm opacity-70">Selected track</div>
              <div className="text-lg font-semibold leading-tight">{trackLabel}</div>
              <div className="text-xs opacity-80 flex items-center gap-1">
                {flag && <span aria-hidden>{flag}</span>}
                <span className="opacity-70">{flag ? '- ' : ''}{country}</span>
              </div>
            </div>
          )}
        </div>
        <WeatherPicker />
      </div>
    </main>
  )
}
