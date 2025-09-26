import MemeBackdrop from '../components/MemeBackdrop'
import WeatherPicker from '../components/WeatherPicker'
import { useEffect, useState } from 'react'
import { labelToCountry, labelToFlag, labelToShortName } from '../lib/constants'

export default function Weather() {
  const [trackLabel, setTrackLabel] = useState<string | null>(null)
  const [trackFull, setTrackFull] = useState<string | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('selectedTrack')
      if (!raw) return
      const data = JSON.parse(raw)
      if (!data || typeof data !== 'object') return
      const full = typeof data.fullLabel === 'string' && data.fullLabel.trim()
        ? data.fullLabel
        : typeof data.label === 'string' && data.label.trim()
        ? data.label
        : null
      if (full) setTrackFull(full)
      const short = typeof data.shortLabel === 'string' && data.shortLabel.trim()
        ? data.shortLabel
        : full
        ? labelToShortName(full)
        : null
      if (short) setTrackLabel(short)
    } catch {}
  }, [])

  const metadataBasis = trackFull ?? trackLabel ?? ''
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
