import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import TyreReel, { TyreReelHandle, TyreReelResult } from '../components/TyreReel'

type Verdict = {
  name: 'Innocent' | 'Guilty'
  color: string
  image: string
  blurb: string
  details: string
}

const VERDICTS: Verdict[] = [
  {
    name: 'Innocent',
    color: '#22c55e',
    image: 'https://64.media.tumblr.com/b76048601260d5ba6ec310d0b3483105/234951bdfc1c3014-de/s1280x1920/826b658af881525266fdb4744f8635faa91f0d01.jpg',
    blurb: 'No further action.',
    details: '"We looked at the data and telemetry - nothing to answer for."',
  },
  {
    name: 'Guilty',
    color: '#e10600',
    image: 'https://e0.365dm.com/16/11/768x432/skysports-rosberg-nico-f1-conclusions_3841470.jpg',
    blurb: 'Straight to jail.',
    details: '"10s penalty for Ocon"',
  },
]

const WHEEL_SIZE = 420
const HUB_SIZE = 180
const IMAGE_FADE_MS = 450

export default function Stewards() {
  const wheelRef = useRef<TyreReelHandle>(null)
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const [spinning, setSpinning] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageVisible, setImageVisible] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)
  const [revealRequested, setRevealRequested] = useState(false)

  const verdictQuote = useMemo(() => {
    if (!verdict) return 'Jeff: "Waiting on the stewards. hold fire for the headline."'
    return verdict.details
  }, [verdict])

  const handleReveal = useCallback((result: TyreReelResult) => {
    const nextVerdict = VERDICTS.find((item) => item.name === result.name)
    if (!nextVerdict) return
    setVerdict(nextVerdict)
    setRevealRequested(true)
    setShowOverlay(true)
    setImageLoaded(false)
    setImageVisible(false)
  }, [])

  useEffect(() => {
    if (!revealRequested || !imageLoaded) return
    setImageVisible(true)
  }, [revealRequested, imageLoaded])

  useEffect(() => {
    if (!imageVisible) return
    const timeout = setTimeout(() => setShowOverlay(false), IMAGE_FADE_MS)
    return () => clearTimeout(timeout)
  }, [imageVisible])

  const handleImageLoaded = useCallback(() => {
    if (typeof window === 'undefined') {
      setImageLoaded(true)
      return
    }
    requestAnimationFrame(() => setImageLoaded(true))
  }, [])

  async function spin() {
    if (spinning) return
    const choice = pickVerdict()
    setSpinning(true)
    setVerdict(null)
    setRevealRequested(false)
    setImageLoaded(false)
    setImageVisible(false)
    setShowOverlay(false)
    await wheelRef.current?.spinTo({ name: choice.name, color: choice.color })
    setSpinning(false)
  }

  return (
    <div className="w-full">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl md:text-4xl font-semibold">Stewards Chamber</h2>
        <p className="text-white/70 italic">{verdictQuote}</p>
      </div>
      <div className="flex flex-col items-center gap-10">
        <div className="relative" style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}>
          <TyreReel ref={wheelRef} size={WHEEL_SIZE} onReveal={handleReveal} />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {verdict ? (
              <div className="relative flex items-center justify-center" style={{ width: HUB_SIZE, height: HUB_SIZE }}>
                <img
                  src={verdict.image}
                  alt={verdict.name}
                  onLoad={handleImageLoaded}
                  style={{
                    width: HUB_SIZE,
                    height: HUB_SIZE,
                    opacity: imageVisible ? 1 : 0,
                    transform: `scale(${imageVisible ? 1 : 0.95})`,
                    transition: `opacity ${IMAGE_FADE_MS}ms ease-out, transform ${IMAGE_FADE_MS}ms ease-out`,
                  }}
                  className="rounded-full object-cover ring-4 ring-white/70 shadow-[0_0_32px_rgba(0,0,0,0.75)]"
                />
                {showOverlay && (
                  <div
                    className="absolute inset-0 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm text-white/70 tracking-wide uppercase"
                    style={{
                      opacity: imageVisible ? 0 : 1,
                      transition: `opacity ${IMAGE_FADE_MS}ms ease-out`,
                    }}
                  >
                    Loading verdict...
                  </div>
                )}
              </div>
            ) : (
              <div
                className="rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-base text-white/70"
                style={{ width: HUB_SIZE, height: HUB_SIZE }}
              >
                Awaiting verdict
              </div>
            )}
          </div>
        </div>
        <div className="text-center space-y-4">
          <button
            onClick={spin}
            disabled={spinning}
            className="px-8 py-3 rounded-md bg-red-600/80 hover:bg-red-600 transition disabled:opacity-60"
          >
            {spinning ? 'Review in progress.' : 'Call the Stewards'}
          </button>
          {verdict && (
            <div className="text-white/85 space-y-1">
              <p className="text-xl font-semibold tracking-wide">Verdict: <span className="uppercase">{verdict.name}</span></p>
              <p className="text-white/70">{verdict.blurb}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function pickVerdict() {
  return VERDICTS[Math.floor(Math.random() * VERDICTS.length)]
}
