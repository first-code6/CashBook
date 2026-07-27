import { useEffect, useRef, useState } from 'react'
import StarBurst, { STAR_BURST_MS } from './StarBurst'

const DAYS = Array.from({ length: 28 }, (_, index) => index + 1)

export default function DayPicker({ value, onChange }) {
  const selected = Number(value)
  const [burst, setBurst] = useState(null) // { day, token }
  const dayRefs = useRef(new Map())
  const burstAnchorRef = useRef(null)
  const clearTimerRef = useRef(0)

  useEffect(
    () => () => {
      window.clearTimeout(clearTimerRef.current)
    },
    [],
  )

  const handlePick = (day) => {
    window.clearTimeout(clearTimerRef.current)

    const el = dayRefs.current.get(day)
    burstAnchorRef.current = el || null
    // token 递增强制重挂载星爆，避免连点时位置/动画不刷新
    setBurst((prev) => ({ day, token: (prev?.token || 0) + 1 }))
    onChange?.(String(day))

    clearTimerRef.current = window.setTimeout(() => {
      setBurst(null)
      burstAnchorRef.current = null
    }, STAR_BURST_MS)
  }

  return (
    <div className="day-picker" role="listbox" aria-label="每月开始日">
      {DAYS.map((day) => {
        const active = selected === day
        const bursting = burst?.day === day
        return (
          <button
            key={day}
            type="button"
            role="option"
            aria-selected={active}
            ref={(node) => {
              if (node) dayRefs.current.set(day, node)
              else dayRefs.current.delete(day)
            }}
            className={`day-picker__day${active ? ' day-picker__day--active' : ''}${
              bursting ? ' day-picker__day--burst' : ''
            }`}
            onClick={() => handlePick(day)}
          >
            {day}
          </button>
        )
      })}
      {burst ? (
        <StarBurst key={burst.token} anchorRef={burstAnchorRef} tone="add" />
      ) : null}
    </div>
  )
}
