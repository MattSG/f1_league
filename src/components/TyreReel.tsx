import React, {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { easeOutCubic } from '../lib/easing'

export type TyreReelResult = {
  name: string
  color: string
}

export type TyreReelHandle = {
  spinTo: (
    result: TyreReelResult,
    opts?: { durationMs?: number; startDelayMs?: number }
  ) => Promise<void>
}

type Props = {
  size?: number
  onReveal?: (result: TyreReelResult) => void
}

const TyreReel = forwardRef<TyreReelHandle, Props>(function TyreReel(
  { size: sizeProp, onReveal },
  ref
) {
  const [rotation, setRotation] = useState(0)
  const [color, setColor] = useState<string>('transparent')
  const [spinning, setSpinning] = useState(false)
  const [fadeColor, setFadeColor] = useState(0)
  const [fadeRainbow, setFadeRainbow] = useState(0)
  const animRef = useRef<number | null>(null)

  const uid = useId()
  const rainbowId = `${uid}-rainbow`
  const wheelShadeId = `${uid}-wheelShade`
  const bandGlossId = `${uid}-bandGloss`
  const rimShadeId = `${uid}-rimShade`
  const rimHighlightId = `${uid}-rimHighlight`
  const hubShadeId = `${uid}-hubShade`
  const lugShadeId = `${uid}-lugShade`

  useEffect(() => {
    return () => {
      if (animRef.current !== null) {
        cancelAnimationFrame(animRef.current)
        animRef.current = null
      }
    }
  }, [])

  useImperativeHandle(
    ref,
    () => ({
      spinTo: (result, opts) => {
        const duration = Math.max(600, Math.floor(opts?.durationMs ?? 1500 + Math.random() * 1200))
        const startDelay = Math.max(0, Math.floor(opts?.startDelayMs ?? 0))
        const turns = 5 + Math.floor(Math.random() * 4)
        const target = rotation + turns * 360
        setColor('transparent')
        setFadeColor(0)
        setFadeRainbow(0)
        setSpinning(true)
        const reduce =
          typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

        return new Promise<void>((resolve) => {
          setTimeout(() => {
            if (reduce) {
              setRotation(target)
              setColor(result.color)
              setFadeRainbow(0)
              setFadeColor(1)
              onReveal?.(result)
              setSpinning(false)
              resolve()
              return
            }

            void fadeRainbowTo(1, 260)

            animateTo(target, duration).then(() => {
              setColor(result.color)
              onReveal?.(result)
              crossFadeRainbowToColor(580).finally(() => {
                setSpinning(false)
                resolve()
              })
            })
          }, startDelay)
        })
      },
    }),
    [rotation, onReveal]
  )

  function animateTo(target: number, duration: number) {
    return new Promise<void>((resolve) => {
      const start = performance.now()
      const from = rotation
      const delta = target - from
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        const eased = easeOutCubic(t)
        const value = from + delta * eased
        setRotation(value)
        if (t < 1) {
          animRef.current = requestAnimationFrame(step)
        } else {
          animRef.current = null
          resolve()
        }
      }
      animRef.current = requestAnimationFrame(step)
    })
  }

  function crossFadeRainbowToColor(duration: number) {
    return new Promise<void>((resolve) => {
      const start = performance.now()
      const rainbowFrom = fadeRainbow
      const colorFrom = fadeColor
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        const eased = easeOutCubic(t)
        const nextRainbow = Math.max(0, rainbowFrom * (1 - eased))
        const nextColor = colorFrom + (1 - colorFrom) * eased
        setFadeRainbow(nextRainbow)
        setFadeColor(nextColor)
        if (t < 1) {
          animRef.current = requestAnimationFrame(step)
        } else {
          animRef.current = null
          setFadeRainbow(0)
          setFadeColor(1)
          resolve()
        }
      }
      animRef.current = requestAnimationFrame(step)
    })
  }

  function fadeRainbowTo(target: number, duration: number) {
    return new Promise<void>((resolve) => {
      const start = performance.now()
      const from = fadeRainbow
      const delta = target - from
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        const eased = easeOutCubic(t)
        setFadeRainbow(from + delta * eased)
        if (t < 1) {
          animRef.current = requestAnimationFrame(step)
        } else {
          animRef.current = null
          resolve()
        }
      }
      animRef.current = requestAnimationFrame(step)
    })
  }

  const size = sizeProp ?? 240
  const cx = size / 2
  const cy = size / 2
  const wheelR = Math.round(size * 0.41)
  const sidewallStroke = Math.max(2, Math.round(size * 0.012))
  const bandR = Math.round(size * 0.315)
  const bandW = Math.max(10, Math.round(size * 0.072))
  const bandHighlightWidth = Math.max(4, Math.round(bandW * 0.64))
  const brandOffset = Math.max(2, Math.round(bandW * 0.2))
  const rimOuterR = Math.round(size * 0.205)
  const rimInnerR = Math.round(size * 0.165)
  const hubOuterR = Math.round(size * 0.09)
  const hubInnerR = Math.round(size * 0.055)
  const hubCoreR = Math.max(4, Math.round(size * 0.032))
  const lugOrbit = Math.round(size * 0.065)
  const lugR = Math.max(2, Math.round(size * 0.014))
  const lugCount = 5
  const spokeCount = 10
  const spokeInnerR = Math.round(size * 0.12)
  const spokeOuterR = rimOuterR
  const spokeStroke = Math.max(1, Math.round(size * 0.008))

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={rainbowId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff004c" />
            <stop offset="16%" stopColor="#ff8a00" />
            <stop offset="32%" stopColor="#ffe600" />
            <stop offset="48%" stopColor="#38ff00" />
            <stop offset="64%" stopColor="#00f7ff" />
            <stop offset="80%" stopColor="#005bff" />
            <stop offset="92%" stopColor="#8f2bff" />
            <stop offset="100%" stopColor="#ff004c" />
          </linearGradient>
          <radialGradient id={wheelShadeId} cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#111" />
            <stop offset="70%" stopColor="#080808" />
            <stop offset="100%" stopColor="#020202" />
          </radialGradient>
          <linearGradient id={bandGlossId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={rimShadeId} cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#2e2e2e" />
            <stop offset="55%" stopColor="#1d1d1d" />
            <stop offset="100%" stopColor="#111" />
          </radialGradient>
          <linearGradient id={rimHighlightId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="55%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.18" />
          </linearGradient>
          <radialGradient id={hubShadeId} cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#3d3d3d" />
            <stop offset="55%" stopColor="#2b2b2b" />
            <stop offset="100%" stopColor="#131313" />
          </radialGradient>
          <radialGradient id={lugShadeId} cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#b7b7b7" />
            <stop offset="60%" stopColor="#707070" />
            <stop offset="100%" stopColor="#2f2f2f" />
          </radialGradient>
        </defs>
        <g transform={`rotate(${rotation} ${cx} ${cy})`}>
          <circle cx={cx} cy={cy} r={wheelR} fill={`url(#${wheelShadeId})`} />
          <circle
            cx={cx}
            cy={cy}
            r={wheelR - sidewallStroke / 2}
            fill="none"
            stroke="#010101"
            strokeOpacity={0.85}
            strokeWidth={sidewallStroke}
          />
          <circle
            cx={cx}
            cy={cy}
            r={bandR}
            fill="none"
            stroke="#050505"
            strokeWidth={bandW + 2}
            strokeOpacity={0.45}
          />
          <circle
            cx={cx}
            cy={cy}
            r={bandR}
            fill="none"
            stroke={`url(#${rainbowId})`}
            strokeWidth={bandW}
            strokeLinecap="round"
            style={{ opacity: fadeRainbow }}
          />
          <circle
            cx={cx}
            cy={cy}
            r={bandR}
            fill="none"
            stroke={color}
            strokeWidth={bandW}
            strokeLinecap="round"
            style={{ opacity: fadeColor }}
          />
          <circle
            cx={cx}
            cy={cy}
            r={bandR}
            fill="none"
            stroke={`url(#${bandGlossId})`}
            strokeWidth={bandHighlightWidth}
            strokeLinecap="round"
            opacity={spinning ? 0.92 : 0.75}
          />
          {new Array(4).fill(0).map((_, i) => (
            <g key={i} transform={`rotate(${i * 90} ${cx} ${cy})`}>
              <text
                x={cx}
                y={cy - bandR + brandOffset}
                textAnchor="middle"
                fontSize={Math.max(9, Math.round(size * 0.055))}
                fill="#ffdf00"
                fontWeight={700}
              >
                {i % 2 === 0 ? 'P ZERO' : 'PIRELLI'}
              </text>
            </g>
          ))}
          <circle cx={cx} cy={cy} r={rimOuterR} fill={`url(#${rimShadeId})`} stroke="#050505" />
          <circle
            cx={cx}
            cy={cy}
            r={rimOuterR}
            fill="none"
            stroke={`url(#${rimHighlightId})`}
            strokeWidth={Math.max(2, Math.round(size * 0.01))}
            opacity={0.65}
          />
          {new Array(spokeCount).fill(0).map((_, i) => {
            const angle = (i * Math.PI * 2) / spokeCount
            const x1 = cx + spokeInnerR * Math.cos(angle)
            const y1 = cy + spokeInnerR * Math.sin(angle)
            const x2 = cx + spokeOuterR * Math.cos(angle)
            const y2 = cy + spokeOuterR * Math.sin(angle)
            return (
              <line
                key={`spoke-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#0c0c0c"
                strokeOpacity={0.45}
                strokeWidth={spokeStroke}
              />
            )
          })}
          <circle cx={cx} cy={cy} r={rimInnerR} fill="#181818" stroke="#2a2a2a" />
          <circle cx={cx} cy={cy} r={hubOuterR} fill={`url(#${hubShadeId})`} stroke="#2c2c2c" />
          <circle cx={cx} cy={cy} r={hubInnerR} fill="#1e1e1e" stroke="#3e3e3e" />
          <circle cx={cx} cy={cy} r={hubCoreR} fill="#141414" stroke="#444" />
          {new Array(lugCount).fill(0).map((_, i) => {
            const angle = (i * Math.PI * 2) / lugCount
            const lx = cx + lugOrbit * Math.cos(angle)
            const ly = cy + lugOrbit * Math.sin(angle)
            return (
              <circle
                key={`lug-${i}`}
                cx={lx}
                cy={ly}
                r={lugR}
                fill={`url(#${lugShadeId})`}
                stroke="#969696"
                strokeWidth={Math.max(1, Math.round(size * 0.0035))}
              />
            )
          })}
        </g>
      </svg>
    </div>
  )
})

export default TyreReel
