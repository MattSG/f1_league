import { useEffect, useRef, useState } from 'react'
import SpinnerWheel, { SpinnerHandle } from '../components/SpinnerWheel'
import SpinButton from '../components/SpinButton'
import SelectedTrackCard from '../components/SelectedTrackCard'
import MemeBackdrop from '../components/MemeBackdrop'
import ConfettiLayer, { ConfettiHandle } from '../components/ConfettiLayer'
import { fetchTracks } from '../lib/googleSheets'
import { SELECTED_TRACK_STORAGE_KEY, toTrackSegment } from '../lib/tracks'
import type { TrackSegment } from '../lib/tracks'
import { secureRandomInt } from '../lib/random'
import { Link, useNavigate } from 'react-router-dom'
import SelectedModal from '../components/SelectedModal'


export default function TrackSelection() {
  const [segments, setSegments] = useState<TrackSegment[]>([])
  const [loadingTracks, setLoadingTracks] = useState(true)
  const [spinning, setSpinning] = useState(false)
  const [selected, setSelected] = useState<TrackSegment | null>(null)
  const [readyForWeather, setReadyForWeather] = useState(false)
  const wheelRef = useRef<SpinnerHandle>(null)
  const confettiRef = useRef<ConfettiHandle>(null)
  const chooseRef = useRef<HTMLAnchorElement>(null)
  const [glowChoose, setGlowChoose] = useState(false)
  const [hasSpun, setHasSpun] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()
  const disableSpin = loadingTracks || !segments.length
  const showWeatherLink = readyForWeather && !loadingTracks

  useEffect(() => {
    let active = true
    setLoadingTracks(true)
    fetchTracks()
      .then((tracks) => {
        if (!active) return
        setSegments(tracks.map(toTrackSegment))
      })
      .catch((error) => {
        if (active) console.warn('Unable to hydrate tracks from sheet.', error)
      })
      .finally(() => {
        if (active) setLoadingTracks(false)
      })
    return () => {
      active = false
    }
  }, [])

  // Do not auto-restore a previous selection on refresh per request
  useEffect(() => {
    if (!selected) {
      localStorage.removeItem(SELECTED_TRACK_STORAGE_KEY)
      return
    }
    localStorage.setItem(SELECTED_TRACK_STORAGE_KEY, JSON.stringify(selected))
  }, [selected])

  // When weather button becomes available, focus it and add a brief glow
  useEffect(() => {
    if (readyForWeather) {
      chooseRef.current?.focus()
      setGlowChoose(true)
      const id = setTimeout(() => setGlowChoose(false), 1500)
      return () => clearTimeout(id)
    }
  }, [readyForWeather])

  const handleSpin = async () => {
    if (disableSpin || spinning) return
    setReadyForWeather(false)
    setSpinning(true)
    setHasSpun(true)
    const index = secureRandomInt(segments.length)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setSelected(segments[index])
      setShowModal(true)
    } else {
      await wheelRef.current?.spinTo(index)
      setSelected(segments[index])
      confettiRef.current?.burst()
      setShowModal(true)
    }
    setTimeout(() => setReadyForWeather(true), 1500)
    setSpinning(false)
  }

  const handleRespin = () => {
    setSelected(null)
    localStorage.removeItem(SELECTED_TRACK_STORAGE_KEY)
    setHasSpun(false)
    setReadyForWeather(false)
    setShowModal(false)
  }

  return (
    <main className="relative">
      <MemeBackdrop />
      <ConfettiLayer ref={confettiRef} />
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8">
        <div className="text-center space-y-2 mb-4">
          <h1 className="f1-heading text-3xl md:text-4xl font-semibold">Track Selection</h1>
        </div>
        <div className="flex flex-col items-center">
          <div className="relative">
            <div
              className={
                'inline-block transition-all duration-500 ' +
                (loadingTracks ? 'pointer-events-none opacity-60 blur-[2px]' : '')
              }
            >
              <SpinnerWheel
                ref={wheelRef}
                segments={segments}
                selectedId={selected?.id}
                spinning={spinning}
                onSettled={(s) => setSelected(s)}
              />
            </div>
            {loadingTracks && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-full bg-black/55 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white/80 animate-pulse backdrop-blur">
                  Syncing results...
                </div>
              </div>
            )}
          </div>
          <div className="mt-2 flex items-center gap-4">
            {!hasSpun && (
              <SpinButton
                onClick={handleSpin}
                loading={spinning}
                aria-label="Spin the wheel"
                disabled={disableSpin}
              />
            )}
            {showWeatherLink && (
              <Link
                to="/weather"
                ref={chooseRef}
                className={
                  'px-4 py-3 rounded bg-white/10 hover:bg-white/20 focus:outline-none ' +
                  (glowChoose ? 'ring-2 ring-red-500 shadow-[0_0_24px_rgba(225,6,0,0.6)]' : '')
                }
              >
                Choose Weather
              </Link>
            )}
          </div>
        </div>
      </div>
      <SelectedTrackCard track={selected} onRespin={handleRespin} />
      <SelectedModal
        open={showModal}
        track={selected}
        onClose={() => setShowModal(false)}
        onRespin={handleRespin}
        onChooseWeather={() => navigate('/weather')}
      />
    </main>
  )
}
