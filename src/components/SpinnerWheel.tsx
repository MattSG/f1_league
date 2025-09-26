import React, { useEffect, useImperativeHandle, useMemo, useRef, useState, forwardRef, useId } from 'react'
import { labelToFlag } from '../lib/constants'
import type { TrackSegment } from '../lib/tracks'
import { easeOutCubic } from '../lib/easing'

export type SpinnerHandle = {
  spinTo: (index: number, opts?: { rotations?: number; durationMs?: number }) => Promise<void>
}

type Props = {
  segments: TrackSegment[]
  selectedId?: string
  onSettled?: (segment: TrackSegment) => void
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

  const uid = useId()
  const insetShadowId = `${uid}-inset-shadow`
  const tyreShadeId = `${uid}-tyreShade`
  const bandGlossId = `${uid}-bandGloss`
  const bandEdgeId = `${uid}-bandEdge`
  const rimShadeId = `${uid}-rimShade`
  const rimHighlightId = `${uid}-rimHighlight`
  const hubShadeId = `${uid}-hubShade`
  const lugShadeId = `${uid}-lugShade`
  const glowYellowId = `${uid}-glow-yellow`

  const n = Math.max(1, segments.length)
  const segmentAngle = 360 / n
  const segmentOffset = segmentAngle / 2

  const activeIndex = useMemo(() => {
    if (!n) return 0
    let r = rotation % 360
    if (r < 0) r += 360
    const thetaNow = 360 - r
    let idx = Math.round((thetaNow - segmentOffset) / segmentAngle)
    idx = ((idx % n) + n) % n
    return idx
  }, [rotation, n, segmentAngle, segmentOffset])

  useImperativeHandle(
    ref,
    () => ({
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
    }),
    [n, segmentOffset, rotation, segments, onSettled]
  )

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
  const radiusOuter = Math.round(size * 0.48)
  const sidewallStroke = Math.max(6, Math.round(size * 0.018))
  const radiusBand = Math.round(size * 0.43)
  const bandStroke = Math.max(24, Math.round(size * 0.048))
  const bandHighlightStroke = Math.max(14, Math.round(bandStroke * 0.58))
  const brandOffset = Math.max(16, Math.round(bandStroke * 0.3))
  const brandFont = Math.max(34, Math.round(size * 0.038))

  const rWedgeOuter = Math.round(size * 0.395)
  const rWedgeInner = Math.round(size * 0.182)

  const rimOuterR = Math.round(size * 0.168)
  const rimInnerR = Math.round(size * 0.132)
  const hubOuterR = Math.round(size * 0.098)
  const hubInnerR = Math.round(size * 0.066)
  const hubCoreR = Math.round(size * 0.04)
  const lugOrbit = Math.round(size * 0.09)
  const lugR = Math.max(4, Math.round(size * 0.016))
  const lugCount = 5
  const spokeCount = 10
  const spokeInnerR = Math.round(size * 0.11)
  const spokeOuterR = rimOuterR
  const spokeStroke = Math.max(2, Math.round(size * 0.009))

  return (
    <div className="relative" style={{ width: 'min(96vw, 960px)', height: 'min(96vw, 960px)' }}>
      <style>{`
        @keyframes pulseHalo { 0%{opacity:.16} 50%{opacity:.4} 100%{opacity:.16} }
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
          <filter id={insetShadowId} x="-50%" y="-50%" width="200%" height="200%">
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
          <radialGradient id={tyreShadeId} cx="50%" cy="50%" r="62%">
            <stop offset="0%" stopColor="#101010" />
            <stop offset="65%" stopColor="#090909" />
            <stop offset="100%" stopColor="#030303" />
          </radialGradient>
          <linearGradient id={bandGlossId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.32" />
            <stop offset="38%" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id={bandEdgeId} x1="0%" y1="0%" x2="100%" y2="0%" gradientTransform="rotate(-25)">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
            <stop offset="22%" stopColor="#ffffff" stopOpacity="0.28" />
            <stop offset="48%" stopColor="#ffffff" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={rimShadeId} cx="50%" cy="50%" r="68%">
            <stop offset="0%" stopColor="#2d2d2d" />
            <stop offset="58%" stopColor="#1d1d1d" />
            <stop offset="100%" stopColor="#111" />
          </radialGradient>
          <linearGradient id={rimHighlightId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
            <stop offset="55%" stopColor="#ffffff" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.22" />
          </linearGradient>
          <radialGradient id={hubShadeId} cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#3d3d3d" />
            <stop offset="55%" stopColor="#2b2b2b" />
            <stop offset="100%" stopColor="#141414" />
          </radialGradient>
          <radialGradient id={lugShadeId} cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#b7b7b7" />
            <stop offset="62%" stopColor="#6f6f6f" />
            <stop offset="100%" stopColor="#2e2e2e" />
          </radialGradient>
          <filter id={glowYellowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g transform={`rotate(${rotation} ${cx} ${cy})`}>
          <circle cx={cx} cy={cy} r={radiusOuter} fill={`url(#${tyreShadeId})`} filter={`url(#${insetShadowId})`} />
          <circle
            cx={cx}
            cy={cy}
            r={radiusOuter - sidewallStroke / 2}
            fill="none"
            stroke="#020202"
            strokeOpacity={0.85}
            strokeWidth={sidewallStroke}
          />
          <circle
            cx={cx}
            cy={cy}
            r={radiusBand}
            fill="none"
            stroke="#050505"
            strokeOpacity={0.55}
            strokeWidth={bandStroke}
          />
          <circle
            cx={cx}
            cy={cy}
            r={radiusBand}
            fill="none"
            stroke={`url(#${bandGlossId})`}
            strokeWidth={bandHighlightStroke}
            strokeLinecap="round"
            opacity={spinning ? 0.9 : 0.75}
          />
          <circle
            cx={cx}
            cy={cy}
            r={radiusBand}
            fill="none"
            stroke={`url(#${bandEdgeId})`}
            strokeWidth={Math.max(10, Math.round(bandHighlightStroke * 0.7))}
            strokeLinecap="round"
            opacity={0.85}
          />
          {new Array(4).fill(0).map((_, i) => (
            <g key={i} transform={`rotate(${i * 90} ${cx} ${cy})`}>
              <text
                x={cx}
                y={cy - radiusBand + brandOffset}
                textAnchor="middle"
                fontSize={brandFont}
                fontWeight={700}
                fill="#ffdf00"
              >
                {i % 2 === 0 ? 'P ZERO' : 'PIRELLI'}
              </text>
            </g>
          ))}
          {segments.map((s, i) => {
            const a0 = i * segmentAngle
            const a1 = (i + 1) * segmentAngle
            const mid = a0 + segmentOffset
            const path = describeWedge(cx, cy, rWedgeOuter, rWedgeInner, a0, a1)
            const selected = s.id === selectedId
            const selectedFinal = !spinning && selected
            const baseAlt = i % 2 === 0 ? '#161616' : '#1d1d1d'
            const fill = selected ? '#252525' : baseAlt
            const fullForFlag = s.fullLabel ?? s.label
            const flag = labelToFlag(fullForFlag)
            const maxChars = n > 18 ? 10 : 12
            const nameLines = wrapLabel(s.label, maxChars)
            const lines = flag && nameLines.length
              ? [flag + ' ' + nameLines[0], ...nameLines.slice(1)]
              : nameLines
            let baseSize = 21
            if (n > 18) baseSize = 19
            if (n > 22) baseSize = 17
            let fontSize = lines.length === 1 ? baseSize : lines.length === 2 ? baseSize - 1 : baseSize - 3
            if (selectedFinal) fontSize += 1
            const labelRadius = rWedgeInner + (rWedgeOuter - rWedgeInner) * 0.56
            const pos = polarToCartesian(cx, cy, labelRadius, mid)
            let orient = normalizeAngle(mid + 90)
            if (orient > 90 && orient < 270) orient -= 180
            const lineGap = fontSize + 3
            const startOffset = -((lines.length - 1) * lineGap) / 2
            const pulseOuter = Math.min(rWedgeOuter + Math.round(size * 0.012), radiusBand - 8)
            const pulseInner = Math.max(rWedgeInner - Math.round(size * 0.012), 12)
            const pulsePath = describeWedge(cx, cy, pulseOuter, pulseInner, a0, a1)
            const clipId = `${uid}-wedge-clip-${i}`
            return (
              <g key={s.id}>
                <defs>
                  <clipPath id={clipId}>
                    <path d={describeWedge(cx, cy, rWedgeOuter, rWedgeInner, a0, a1)} />
                  </clipPath>
                </defs>
                <path d={path} fill={fill} stroke="#000" strokeOpacity={0.35} />
                {spinning && i === activeIndex && (
                  <g clipPath={`url(#${clipId})`}>
                    <path d={path} fill="#ffdf00" opacity={0.15} filter={`url(#${glowYellowId})`} />
                    <path d={path} fill="none" stroke="#ffdf00" strokeOpacity={0.5} strokeWidth={2} />
                  </g>
                )}
                {selectedFinal && (
                  <g clipPath={`url(#${clipId})`}>
                    <path
                      d={pulsePath}
                      fill="#ffdf00"
                      opacity={0.12}
                      filter={`url(#${glowYellowId})`}
                      style={{ animation: 'pulseHalo 1300ms ease-in-out infinite' }}
                    />
                    <path
                      d={pulsePath}
                      fill="none"
                      stroke="#ffdf00"
                      strokeOpacity={0.45}
                      strokeWidth={2}
                      style={{ animation: 'pulseHalo 1300ms ease-in-out infinite' }}
                    />
                  </g>
                )}
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
          <circle cx={cx} cy={cy} r={rimOuterR} fill={`url(#${rimShadeId})`} stroke="#050505" strokeWidth={2} />
          <circle
            cx={cx}
            cy={cy}
            r={rimOuterR}
            fill="none"
            stroke={`url(#${rimHighlightId})`}
            strokeWidth={Math.max(3, Math.round(size * 0.012))}
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
                strokeOpacity={0.5}
                strokeWidth={spokeStroke}
              />
            )
          })}
          <circle cx={cx} cy={cy} r={rimInnerR} fill="#1a1a1a" stroke="#2a2a2a" />
          <circle cx={cx} cy={cy} r={hubOuterR} fill={`url(#${hubShadeId})`} stroke="#353535" />
          <circle cx={cx} cy={cy} r={hubInnerR} fill="#1f1f1f" stroke="#3b3b3b" />
          <circle cx={cx} cy={cy} r={hubCoreR} fill="#151515" stroke="#494949" />
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
                strokeWidth={Math.max(2, Math.round(size * 0.004))}
              />
            )
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
