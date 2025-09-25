import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { easeOutCubic } from '../lib/easing'

export type TyreReelHandle = {
  spinTo: (result: { name: string; color: string }) => Promise<void>
}

const TyreReel = forwardRef<TyreReelHandle, {}>(function TyreReel(_, ref) {
  const [rotation, setRotation] = useState(0)
  const [color, setColor] = useState<string>('transparent')
  const [spinning, setSpinning] = useState(false)
  const animRef = useRef<number | null>(null)

  useImperativeHandle(ref, () => ({
    spinTo: (result) => {
      const duration = 1500 + Math.random() * 1200
      const turns = 5 + Math.floor(Math.random() * 4)
      const target = rotation + turns * 360
      setSpinning(true)
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) {
        setColor(result.color)
        setSpinning(false)
        return Promise.resolve()
      }
      return animateTo(target, duration).then(() => {
        setColor(result.color)
        setSpinning(false)
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

  const size = 170
  const cx = size / 2
  const cy = size / 2

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
          <circle cx={cx} cy={cy} r={70} fill="url(#wheelShade)" />
          {/* Band color shows weather category; spins with rainbow when spinning */}
          <circle
            cx={cx}
            cy={cy}
            r={54}
            fill="none"
            stroke={spinning ? 'url(#rainbow)' : color}
            strokeWidth={12}
            style={spinning ? { filter: 'hue-rotate(0deg)', transition: 'stroke 300ms' } : undefined}
          />
          {/* PIRELLI branding */}
          {new Array(3).fill(0).map((_, i) => (
            <g key={i} transform={`rotate(${i * 120} ${cx} ${cy})`}>
              <text x={cx} y={cy - 54 + 7} textAnchor="middle" fontSize={11} fill="#ffdf00" fontWeight={700}>
                PIRELLI
              </text>
            </g>
          ))}
          <circle cx={cx} cy={cy} r={30} fill="var(--tyre-rim)" />
          <circle cx={cx} cy={cy} r={8} fill="#2b2b2b" stroke="#444" />
        </g>
      </svg>
    </div>
  )
})

export default TyreReel
