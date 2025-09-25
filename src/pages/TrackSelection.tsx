import { useEffect, useRef, useState } from 'react'
import SpinnerWheel, { SpinnerHandle } from '../components/SpinnerWheel'
import SpinButton from '../components/SpinButton'
import SelectedTrackCard from '../components/SelectedTrackCard'
import MemeBackdrop from '../components/MemeBackdrop'
import ConfettiLayer, { ConfettiHandle } from '../components/ConfettiLayer'
import { fetchTracks } from '../lib/googleSheets'
import { labelToCountry } from '../lib/constants'
import { secureRandomInt } from '../lib/random'
import { Link } from 'react-router-dom'

type Segment = { id: string; label: string }

export default function TrackSelection() {
  const [segments, setSegments] = useState<Segment[]>([])
  const [spinning, setSpinning] = useState(false)
  const [selected, setSelected] = useState<Segment | null>(null)
  const [readyForWeather, setReadyForWeather] = useState(false)
  const wheelRef = useRef<SpinnerHandle>(null)
  const confettiRef = useRef<ConfettiHandle>(null)

  useEffect(() => {
    fetchTracks().then((tracks) => {
      const mapped = tracks.map((t) => ({ id: t.id, label: labelToCountry(t.label) }))
      setSegments(mapped)
    })
  }, [])

  // load persisted selection
  useEffect(() => {
    const raw = localStorage.getItem('selectedTrack')
    if (raw) try { setSelected(JSON.parse(raw)) } catch {}
  }, [])

  useEffect(() => {
    if (selected) localStorage.setItem('selectedTrack', JSON.stringify(selected))
  }, [selected])

  const handleSpin = async () => {
    if (!segments.length || spinning) return
    setReadyForWeather(false)
    setSpinning(true)
    const index = secureRandomInt(segments.length)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setSelected(segments[index])
    } else {
      await wheelRef.current?.spinTo(index)
      setSelected(segments[index])
      confettiRef.current?.burst()
    }
    setTimeout(() => setReadyForWeather(true), 1500)
    setSpinning(false)
  }

  const handleRespin = () => {
    setSelected(null)
    localStorage.removeItem('selectedTrack')
  }

  return (
    <main className="relative">
      <MemeBackdrop />
      <ConfettiLayer ref={confettiRef} />
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8">
        <div className="text-center space-y-2 mb-4">
          <h1 className="text-3xl md:text-4xl font-semibold">Track Selection</h1>
          <p className="text-white/70">F1‑style wheel. Press spin to choose the track.</p>
        </div>
        <div className="flex flex-col items-center">
          <SpinnerWheel
            ref={wheelRef}
            segments={segments}
            selectedId={selected?.id}
            spinning={spinning}
            onSettled={(s) => setSelected(s)}
          />
          <div className="mt-6 flex items-center gap-4">
            <SpinButton onClick={handleSpin} loading={spinning} aria-label="Spin the wheel" />
            {readyForWeather && (
              <Link to="/weather" className="px-4 py-3 rounded bg-white/10 hover:bg-white/20">
                Choose Weather
              </Link>
            )}
          </div>
        </div>
      </div>
      <SelectedTrackCard track={selected} onRespin={handleRespin} />
    </main>
  )
}
