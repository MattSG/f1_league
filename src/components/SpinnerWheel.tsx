import React, { useEffect, useImperativeHandle, useMemo, useRef, useState, forwardRef } from 'react'
import { labelToFlag } from '../lib/constants'
import { easeOutCubic } from '../lib/easing'

type Segment = { id: string; label: string }

export type SpinnerHandle = {
  spinTo: (index: number, opts?: { rotations?: number; durationMs?: number }) => Promise<void>
}

type Props = {
  segments: Segment[]
  selectedId?: string
  onSettled?: (segment: Segment) => void
  spinning: boolean
}

const SpinnerWheel = forwardRef<SpinnerHandle, Props>(function SpinnerWheel(
  { segments, selectedId, onSettled, spinning },
  ref
) {
  const [rotation, setRotation] = useState(0)
  const animRef = useRef<number | null>(null)
  const startRotRef = useRef(0)
  const targetRef = useRef(0)

  const n = Math.max(1, segments.length)
  const segmentAngle = 360 / n
  const segmentOffset = segmentAngle / 2

  const pointer = useMemo(() => ({ x: 0, y: -1 }), [])

  // Compute which segment is currently under the fixed pointer (top)
  const activeIndex = useMemo(() => {
    if (!n) return 0
    let r = rotation % 360
    if (r < 0) r += 360
    const thetaNow = 360 - r
    let idx = Math.round((thetaNow - segmentOffset) / segmentAngle)
    idx = ((idx % n) + n) % n
    return idx
  }, [rotation, n, segmentAngle, segmentOffset])

  useImperativeHandle(ref, () => ({
    spinTo: (index, opts) => {
      const duration = Math.max(300, Math.min(12000, opts?.durationMs ?? rand(4500, 7000)))
      const rotations = Math.floor(opts?.rotations ?? rand(4, 8))
      const theta = 360 * (index / n) + segmentOffset
      const total = rotations * 360 + (360 - theta)
      startRotRef.current = rotation % 360
      const nextTarget = rotation + (total - startRotRef.current)
      targetRef.current = nextTarget
      return animateTo(nextTarget, duration).then(() => {
        const seg = segments[index]
        if (seg && onSettled) onSettled(seg)
      })
    },
  }), [n, segmentOffset, rotation, segments, onSettled])

  useEffect(() => () => { if (animRef.current) cancelAnimationFrame(animRef.current) }, [])

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

  const size = 960
  const cx = size / 2
  const cy = size / 2
  const radiusOuter = Math.round(size * 0.46)
  const radiusBand = Math.round(size * 0.40)
  const rWedgeOuter = Math.round(size * 0.37)
  const rWedgeInner = Math.round(size * 0.18)

  return (
    <div className="relative" style={{ width: 'min(96vw, 960px)', height: 'min(96vw, 960px)' }}>
      <style>{`
        @keyframes pulseHalo { 0%{opacity:.14} 50%{opacity:.38} 100%{opacity:.14} }
      `}</style>
      {/* fixed pointer */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 translate-y-2 z-20 pointer-events-none" aria-hidden>
        <svg width="22" height="32" viewBox="0 0 22 32" fill="none">
          <path d="M11 32 L22 0 L0 0 Z" fill="#ffdf00" />
          <path d="M11 29 L20 1.5 L2 1.5 Z" fill="#e10600" />
        </svg>
      </div>
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Spinning wheel">
        <defs>
          <filter id="inset-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feComponentTransfer in="SourceAlpha">
              <feFuncA type="table" tableValues="1 0" />
            </feComponentTransfer>
            <feGaussianBlur stdDeviation="4" />
            <feOffset dx="0" dy="2" />
            <feComposite operator="arithmetic" k2="-1" k3="1" result="shadowDiff" />
            <feFlood floodColor="#000" floodOpacity="0.6" />
            <feComposite in2="shadowDiff" operator="in" />
            <feComposite in2="SourceGraphic" operator="over" />
          </filter>
          <radialGradient id="tyreShade" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#0f0f0f" />
            <stop offset="70%" stopColor="#0a0a0a" />
            <stop offset="100%" stopColor="#050505" />
          </radialGradient>
          <linearGradient id="bandGloss" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="rimShade" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#2a2a2a" />
            <stop offset="60%" stopColor="#1e1e1e" />
            <stop offset="100%" stopColor="#141414" />
          </radialGradient>
          <filter id="glow-yellow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* spinning group */}
        <g transform={`rotate(${rotation} ${cx} ${cy})`}>
          {/* Tyre tread */}
          <circle cx={cx} cy={cy} r={radiusOuter} fill="url(#tyreShade)" filter="url(#inset-shadow)" />
          {/* Soft band ring */}
          <circle cx={cx} cy={cy} r={radiusBand} fill="none" stroke="#e10600" strokeWidth={28} />
          {/* Sidewall edge rings for realism */}
          <circle cx={cx} cy={cy} r={radiusOuter - 6} fill="none" stroke="#050505" strokeWidth={3} opacity={0.8} />
          <circle cx={cx} cy={cy} r={radiusBand - 16} fill="none" stroke="#0b0b0b" strokeWidth={3} opacity={0.8} />
          {/* Gloss highlight */}
          <circle cx={cx} cy={cy} r={radiusBand + 1} fill="none" stroke="url(#bandGloss)" strokeWidth={10} />

          {/* Band branding: alternate PIRELLI and P ZERO around the ring */}
          {new Array(8).fill(0).map((_, i) => (
            <g key={i} transform={`rotate(${i * 45} ${cx} ${cy})`}>
              <text x={cx} y={cy - radiusBand + 8} textAnchor="middle" fontSize={18} fill="#ffdf00" fontWeight={700}>
                {i % 2 === 0 ? 'P ZERO' : 'PIRELLI'}
              </text>
            </g>
          ))}

          {/* Rim with subtle spokes */}
          <circle cx={cx} cy={cy} r={Math.round(size * 0.12)} fill="url(#rimShade)" />
          {new Array(10).fill(0).map((_, i) => {
            const a = i * 36
            const inner = polarToCartesian(cx, cy, Math.round(size * 0.068), a)
            const outer = polarToCartesian(cx, cy, Math.round(size * 0.12), a)
            return (
              <line key={i} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="#0c0c0c" strokeOpacity={0.5} strokeWidth={2} />
            )
          })}
          {/* Wedge segments ring */}
          {segments.map((s, i) => {
            const a0 = i * segmentAngle
            const a1 = (i + 1) * segmentAngle
            const mid = a0 + segmentOffset
            const largeArc = segmentAngle > 180 ? 1 : 0
            const path = describeWedge(cx, cy, rWedgeOuter, rWedgeInner, a0, a1)
            const selected = s.id === selectedId
            const selectedFinal = !spinning && selected
            const fill = selected ? '#242424' : i % 2 === 0 ? '#141414' : '#1b1b1b'
            const fullForFlag = (s as any).fullLabel ?? s.label
            const flag = labelToFlag(fullForFlag)
            const maxChars = n > 18 ? 10 : 12
            const nameLines = wrapLabel(s.label, maxChars)
            const lines = flag && nameLines.length
              ? [flag + ' ' + nameLines[0], ...nameLines.slice(1)]
              : nameLines
            let baseSize = 20
            if (n > 18) baseSize = 18
            if (n > 22) baseSize = 16
            let fontSize = lines.length === 1 ? baseSize : lines.length === 2 ? baseSize - 1 : baseSize - 3
            if (selectedFinal) fontSize += 1
            const labelRadius = rWedgeInner + (rWedgeOuter - rWedgeInner) * 0.60
            const pos = polarToCartesian(cx, cy, labelRadius, mid)
            // Orientation along tangent with upright correction (rotate around label position)
            let orient = normalizeAngle(mid + 90)
            if (orient > 90 && orient < 270) orient -= 180
            const lineGap = fontSize + 2
            const startOffset = -((lines.length - 1) * lineGap) / 2
            // Pulse overlay geometry, clamped; clipPath confines any blur within wedge ring
            const pulseOuter = Math.min(rWedgeOuter + Math.round(size * 0.012), radiusBand - 8)
            const pulseInner = Math.max(rWedgeInner - Math.round(size * 0.012), 10)
            const pulsePath = describeWedge(cx, cy, pulseOuter, pulseInner, a0, a1)
            const clipId = `wedge-clip-${i}`
            return (
              <g key={s.id}>
                <defs>
                  <clipPath id={clipId}>
                    <path d={describeWedge(cx, cy, rWedgeOuter, rWedgeInner, a0, a1)} />
                  </clipPath>
                </defs>
                {/* base wedge */}
                <path d={path} fill={fill} stroke="#000" strokeOpacity={0.35} />
                {/* highlight when under pointer during spin */}
                {spinning && i === activeIndex && (
                  <g clipPath={`url(#${clipId})`}>
                    <path d={path} fill="#ffdf00" opacity={0.15} filter="url(#glow-yellow)" />
                    <path d={path} fill="none" stroke="#ffdf00" strokeOpacity={0.5} strokeWidth={2} />
                  </g>
                )}
                {/* post-selection pulse and slight size accent */}
                {selectedFinal && (
                  <g clipPath={`url(#${clipId})`}>
                    <path d={pulsePath} fill="#ffdf00" opacity={0.12} filter="url(#glow-yellow)" style={{ animation: 'pulseHalo 1300ms ease-in-out infinite' }} />
                    <path d={pulsePath} fill="none" stroke="#ffdf00" strokeOpacity={0.45} strokeWidth={2} style={{ animation: 'pulseHalo 1300ms ease-in-out infinite' }} />
                  </g>
                )}
                {/* label aligned and rotated around its own anchor point */}
                <g transform={`rotate(${orient} ${pos.x} ${pos.y})`}>
                  <text
                    x={pos.x}
                    y={pos.y + startOffset}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={fontSize}
                    fill={selected ? '#ffdf00' : '#ffffff'}
                    opacity={0.98}
                  >
                    {lines.map((ln, li) => (
                      <tspan key={li} x={pos.x} dy={li === 0 ? 0 : lineGap}>
                        {ln}
                      </tspan>
                    ))}
                  </text>
                </g>
              </g>
            )
          })}

          {/* Center hub + lug nuts */}
          <circle cx={cx} cy={cy} r={Math.round(size * 0.027)} fill="#2b2b2b" stroke="#444" />
          {new Array(5).fill(0).map((_, i) => {
            const p = polarToCartesian(cx, cy, Math.round(size * 0.019), i * (360 / 5))
            return <circle key={i} cx={p.x} cy={p.y} r={2.5} fill="#666" stroke="#999" />
          })}
        </g>
      </svg>
    </div>
  )
})

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export default SpinnerWheel

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180
  return { x: cx + r * Math.sin(a), y: cy - r * Math.cos(a) }
}

function describeWedge(cx: number, cy: number, rOuter: number, rInner: number, a0: number, a1: number) {
  const p1 = polarToCartesian(cx, cy, rOuter, a0)
  const p2 = polarToCartesian(cx, cy, rOuter, a1)
  const p3 = polarToCartesian(cx, cy, rInner, a1)
  const p4 = polarToCartesian(cx, cy, rInner, a0)
  const largeArc = a1 - a0 > 180 ? 1 : 0
  return [
    `M ${p1.x} ${p1.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${p4.x} ${p4.y}`,
    'Z',
  ].join(' ')
}

function wrapLabel(label: string, maxChars = 18) {
  const words = label.split(/\s+/)
  const lines: string[] = []
  let current = ''
  for (const w of words) {
    const next = current ? current + ' ' + w : w
    if (next.length > maxChars && current) {
      lines.push(current)
      current = w
    } else {
      current = next
    }
  }
  if (current) lines.push(current)
  if (lines.length > 3) {
    const first = lines[0]
    const second = lines[1]
    const rest = lines.slice(2).join(' ')
    return [first, second, rest]
  }
  return lines
}

function normalizeAngle(a: number) {
  let x = a % 360
  if (x < 0) x += 360
  return x
}
