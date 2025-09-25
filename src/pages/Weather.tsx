import MemeBackdrop from '../components/MemeBackdrop'
import WeatherPicker from '../components/WeatherPicker'
import { useEffect, useState } from 'react'
import { labelToCountry, labelToFlag } from '../lib/constants'

export default function Weather() {
  const [trackLabel, setTrackLabel] = useState<string | null>(null)
  const [trackFull, setTrackFull] = useState<string | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('selectedTrack')
      if (raw) {
        const t = JSON.parse(raw)
        if (t?.label && typeof t.label === 'string') setTrackLabel(t.label)
        if (t?.fullLabel && typeof t.fullLabel === 'string') setTrackFull(t.fullLabel)
      }
    } catch {}
  }, [])
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
                <span aria-hidden>{labelToFlag(trackFull ?? trackLabel)}</span>
                <span className="opacity-70">- {labelToCountry(trackFull ?? trackLabel)}</span>
              </div>
            </div>
          )}
        </div>
        <WeatherPicker />
      </div>
    </main>
  )
}
