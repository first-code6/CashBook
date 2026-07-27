import { useLayoutEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

export const STAR_BURST_MS = 900
const STAR_COUNT = 14

function edgePoint(angle) {
  const dx = Math.cos(angle)
  const dy = Math.sin(angle)
  const sx = Math.abs(dx) < 1e-6 ? Number.POSITIVE_INFINITY : 0.5 / Math.abs(dx)
  const sy = Math.abs(dy) < 1e-6 ? Number.POSITIVE_INFINITY : 0.5 / Math.abs(dy)
  const scale = Math.min(sx, sy)
  return { x: dx * scale, y: dy * scale, dx, dy }
}

function buildStars(box, tone = 'add') {
  const side = Math.min(box.width || 280, box.height || 64)
  const vwCap =
    typeof window !== 'undefined' ? Math.min(window.innerWidth, window.innerHeight) * 0.045 : 28
  const flyBase = Math.min(tone === 'edit' ? 26 : 30, Math.max(12, side * 0.14, vwCap * 0.55))
  const sizeBig = Math.min(16, Math.max(11, side * 0.1 + 4))
  const sizeSmall = Math.max(9, sizeBig - 3)

  return Array.from({ length: STAR_COUNT }, (_, i) => {
    const angle = (Math.PI * 2 * i) / STAR_COUNT - Math.PI / 2
    const edge = edgePoint(angle)
    const fly = flyBase + (i % 3) * (flyBase * 0.18)
    return {
      i,
      left: `${(0.5 + edge.x) * 100}%`,
      top: `${(0.5 + edge.y) * 100}%`,
      dx: Math.round(edge.dx * fly),
      dy: Math.round(edge.dy * fly),
      size: i % 2 === 0 ? sizeBig : sizeSmall,
    }
  })
}

function RoundedStarIcon() {
  return (
    <svg className="history-item__star-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2.6l2.7 6.2 6.7.6-5.1 4.5 1.5 6.5L12 16.8 6.2 20.4l1.5-6.5L2.6 9.4l6.7-.6L12 2.6z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** 锚点边缘星爆（与记账新增同款） */
export default function StarBurst({ anchorRef, tone = 'add' }) {
  const [box, setBox] = useState(null)
  const stars = useMemo(() => (box ? buildStars(box, tone) : []), [box, tone])

  useLayoutEffect(() => {
    const el = anchorRef?.current
    if (!el) return undefined

    const update = () => {
      const rect = el.getBoundingClientRect()
      setBox({
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      })
    }

    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [anchorRef])

  if (!box || stars.length === 0) return null

  const pad = Math.max(20, Math.min(36, Math.min(box.width, box.height) * 0.2))

  return createPortal(
    <div
      className={`history-burst-layer history-burst-layer--${tone}`}
      style={{
        left: box.left - pad,
        top: box.top - pad,
        width: box.width + pad * 2,
        height: box.height + pad * 2,
      }}
      aria-hidden="true"
    >
      {stars.map((star) => {
        const xRatio = Number.parseFloat(star.left) / 100
        const yRatio = Number.parseFloat(star.top) / 100
        return (
          <span
            key={star.i}
            className={`history-item__star history-item__star--${star.i % 3}`}
            style={{
              left: pad + xRatio * box.width,
              top: pad + yRatio * box.height,
              '--dx': `${star.dx}px`,
              '--dy': `${star.dy}px`,
              '--star-size': `${star.size}px`,
            }}
          >
            <RoundedStarIcon />
          </span>
        )
      })}
    </div>,
    document.body,
  )
}
