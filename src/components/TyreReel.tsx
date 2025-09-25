import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { easeOutCubic } from '../lib/easing'

export type TyreReelHandle = {
  spinTo: (
    result: { name: string; color: string },
    opts?: { durationMs?: number; startDelayMs?: number }
  ) => Promise<void>
}

type Props = { size?: number }

const TyreReel = forwardRef<TyreReelHandle, Props>(function TyreReel({ size: sizeProp }, ref) {
  const [rotation, setRotation] = useState(0)
  const [color, setColor] = useState<string>('transparent')
  const [spinning, setSpinning] = useState(false)
  // fadeColor: 0 => no final color visible, 1 => fully final color
  const [fadeColor, setFadeColor] = useState(0)
  // fadeRainbow: 0 => rainbow hidden, 1 => fully rainbow
  const [fadeRainbow, setFadeRainbow] = useState(0)
  const animRef = useRef<number | null>(null)

  useImperativeHandle(ref, () => ({
    spinTo: (result, opts) => {
      const duration = Math.max(600, Math.floor(opts?.durationMs ?? 1500 + Math.random() * 1200))
      const startDelay = Math.max(0, Math.floor(opts?.startDelayMs ?? 0))
      const turns = 5 + Math.floor(Math.random() * 4)
      const target = rotation + turns * 360
      // Reset baseline immediately so previous color clears during any start delay
      setColor('transparent')
      setFadeColor(0)
      setFadeRainbow(0)
      setSpinning(true)
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          if (reduce) {
            setColor(result.color)
            setFadeRainbow(0)
            setFadeColor(1)
            setSpinning(false)
            resolve()
            return
          }
          // Fade in rainbow as spin begins
          fadeRainbowTo(1, 200)
          animateTo(target, duration).then(() => {
            setColor(result.color)
            Promise.all([
              fadeTo(1, 420),
              fadeRainbowTo(0, 420),
            ]).then(() => { setSpinning(false); resolve() })
          })
        }, startDelay)
      })
    },
  }), [rotation])

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
          resolve()
        }
      }
      animRef.current = requestAnimationFrame(step)
    })
  }

  function fadeTo(target: number, duration: number) {
    return new Promise<void>((resolve) => {
      const start = performance.now()
      const from = fadeColor
      const delta = target - from
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        const eased = easeOutCubic(t)
        setFadeColor(from + delta * eased)
        if (t < 1) animRef.current = requestAnimationFrame(step)
        else resolve()
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
        if (t < 1) animRef.current = requestAnimationFrame(step)
        else resolve()
      }
      animRef.current = requestAnimationFrame(step)
    })
  }

  const size = sizeProp ?? 240
  const cx = size / 2
  const cy = size / 2
  const wheelR = Math.round(size * 0.412) // ~70 when size=170
  const bandR = Math.round(size * 0.318)  // ~54 when size=170
  const bandW = Math.round(size * 0.071)  // ~12 when size=170
  const rimR = Math.round(size * 0.176)   // ~30 when size=170
  const hubR = Math.round(size * 0.047)   // ~8 when size=170

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f00" />
            <stop offset="20%" stopColor="#ff0" />
            <stop offset="40%" stopColor="#0f0" />
            <stop offset="60%" stopColor="#0ff" />
            <stop offset="80%" stopColor="#00f" />
            <stop offset="100%" stopColor="#f0f" />
          </linearGradient>
          <radialGradient id="wheelShade" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#101010" />
            <stop offset="70%" stopColor="#0a0a0a" />
            <stop offset="100%" stopColor="#050505" />
          </radialGradient>
        </defs>
        <g transform={`rotate(${rotation} ${cx} ${cy})`}>
          <circle cx={cx} cy={cy} r={wheelR} fill="url(#wheelShade)" />
          {/* Base black band (always present) */}
          <circle cx={cx} cy={cy} r={bandR} fill="none" stroke="#111" strokeWidth={bandW} />
          {/* Rainbow band layer (fades in on spin start) */}
          <circle
            cx={cx}
            cy={cy}
            r={bandR}
            fill="none"
            stroke={'url(#rainbow)'}
            strokeWidth={bandW}
            style={{ opacity: fadeRainbow, transition: 'opacity 150ms linear' }}
          />
          {/* Final color band layer (crossfades in) */}
          <circle
            cx={cx}
            cy={cy}
            r={bandR}
            fill="none"
            stroke={color}
            strokeWidth={bandW}
            style={{ opacity: fadeColor, transition: 'opacity 150ms linear' }}
          />
          {/* PIRELLI branding */}
          {new Array(4).fill(0).map((_, i) => (
            <g key={i} transform={`rotate(${i * 90} ${cx} ${cy})`}>
              <text
                x={cx}
                y={cy - bandR + Math.max(2, Math.round(bandW * 0.35))}
                textAnchor="middle"
                fontSize={Math.max(9, Math.round(size * 0.055))}
                fill="#ffdf00"
                fontWeight={700}
              >
                {i % 2 === 0 ? 'P ZERO' : 'PIRELLI'}
              </text>
            </g>
          ))}
          <circle cx={cx} cy={cy} r={rimR} fill="var(--tyre-rim)" />
          <circle cx={cx} cy={cy} r={hubR} fill="#2b2b2b" stroke="#444" />
        </g>
      </svg>
    </div>
  )
})

export default TyreReel
