import { useImperativeHandle, forwardRef } from 'react'
import confetti from 'canvas-confetti'

export type ConfettiHandle = {
  burst: (opts?: { particles?: number }) => void
}

const ConfettiLayer = forwardRef<ConfettiHandle, {}>(function ConfettiLayer(_, ref) {
  useImperativeHandle(ref, () => ({
    burst: (opts) => {
      const particles = opts?.particles ?? 320
      const scalar = 0.9
      // Shift celebration roughly 1/5 lower than center
      const centerY = 0.7
      const clamp = (v: number) => Math.max(0, Math.min(1, v))
      const origins = [
        { x: 0.5, y: centerY },
        { x: 0.15, y: clamp(centerY - 0.25) },
        { x: 0.85, y: clamp(centerY - 0.25) },
        { x: 0.15, y: clamp(centerY + 0.15) },
        { x: 0.85, y: clamp(centerY + 0.15) },
        { x: 0.5, y: clamp(centerY - 0.35) },
        { x: 0.5, y: clamp(centerY + 0.25) },
        { x: 0.25, y: clamp(centerY) },
        { x: 0.75, y: clamp(centerY) },
      ]
      const spreads = [80, 110, 140]
      origins.forEach((origin, oi) => {
        spreads.forEach((spread, si) => {
          const count = Math.floor(particles * (oi === 0 ? 0.35 : 0.12) * (1 - si * 0.12))
          setTimeout(
            () =>
              confetti({
                origin,
                spread,
                scalar,
                particleCount: count,
                zIndex: 9999,
                disableForReducedMotion: true,
              }),
            oi * 80 + si * 110,
          )
        })
      })
    },
  }), [])

  return null
})

export default ConfettiLayer
