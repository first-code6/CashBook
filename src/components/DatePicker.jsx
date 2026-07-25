import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  buildDateKey,
  getDaysInMonth,
  getMonthStartWeekday,
  getToday,
} from '../lib/date'

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日']

function toMonth(dateKey) {
  return (dateKey || getToday()).slice(0, 7)
}

function shiftMonth(month, delta) {
  const [year, monthValue] = month.split('-').map(Number)
  const base = new Date(year, monthValue - 1 + delta, 1)
  const nextYear = base.getFullYear()
  const nextMonth = String(base.getMonth() + 1).padStart(2, '0')
  return `${nextYear}-${nextMonth}`
}

function formatDisplay(dateKey, compact = false) {
  if (!dateKey || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return '选择日期'
  const [year, month, day] = dateKey.split('-')
  if (compact) {
    return `${Number(month)}月${Number(day)}日`
  }
  return `${year}年${Number(month)}月${Number(day)}日`
}

export default function DatePicker({ value, onChange, floating = false }) {
  const [open, setOpen] = useState(false)
  const [viewMonth, setViewMonth] = useState(() => toMonth(value))
  const rootRef = useRef(null)
  const today = getToday()

  useEffect(() => {
    if (open) setViewMonth(toMonth(value || today))
  }, [open, value, today])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const cells = useMemo(() => {
    const total = getDaysInMonth(viewMonth)
    const startWeekday = getMonthStartWeekday(viewMonth)
    const result = []
    for (let i = 0; i < startWeekday; i += 1) {
      result.push({ key: `empty-${i}`, empty: true })
    }
    for (let day = 1; day <= total; day += 1) {
      result.push({ key: buildDateKey(viewMonth, day), day, date: buildDateKey(viewMonth, day) })
    }
    return result
  }, [viewMonth])

  const handleSelect = (dateKey) => {
    onChange(dateKey)
    setOpen(false)
  }

  const panel = (
    <div
      className={`ui-datepicker__panel${floating ? ' ui-datepicker__panel--floating' : ''}`}
      role="dialog"
      aria-label="选择日期"
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="ui-datepicker__header">
        <button
          type="button"
          className="ui-datepicker__nav"
          onClick={() => setViewMonth((month) => shiftMonth(month, -1))}
          aria-label="上一月"
        >
          ‹
        </button>
        <span className="ui-datepicker__title">
          {viewMonth.split('-')[0]}年{Number(viewMonth.split('-')[1])}月
        </span>
        <button
          type="button"
          className="ui-datepicker__nav"
          onClick={() => setViewMonth((month) => shiftMonth(month, 1))}
          aria-label="下一月"
        >
          ›
        </button>
      </div>

      <div className="ui-datepicker__weekdays">
        {WEEKDAYS.map((label) => (
          <span key={label} className="ui-datepicker__weekday">
            {label}
          </span>
        ))}
      </div>

      <div className="ui-datepicker__grid">
        {cells.map((cell) => {
          if (cell.empty) {
            return <span key={cell.key} className="ui-datepicker__cell ui-datepicker__cell--empty" />
          }
          const isSelected = cell.date === value
          const isToday = cell.date === today
          return (
            <button
              key={cell.key}
              type="button"
              className={[
                'ui-datepicker__cell',
                isSelected ? 'ui-datepicker__cell--selected' : '',
                isToday ? 'ui-datepicker__cell--today' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => handleSelect(cell.date)}
            >
              {cell.day}
            </button>
          )
        })}
      </div>

      <div className="ui-datepicker__footer">
        <button type="button" className="ui-datepicker__today" onClick={() => handleSelect(today)}>
          今天
        </button>
      </div>
    </div>
  )

  return (
    <div className={`ui-datepicker${floating ? ' ui-datepicker--floating' : ''}`} ref={rootRef}>
      <button
        type="button"
        className={`ui-select__control${open ? ' ui-select__control--open' : ''}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={`ui-select__value${value ? '' : ' ui-select__value--placeholder'}`}>
          {formatDisplay(value, floating)}
        </span>
        <span className="ui-select__arrow" aria-hidden="true" />
      </button>

      {floating
        ? open &&
          createPortal(
            <div className="ui-datepicker__layer" role="presentation">
              {/*
                用 click 关闭，不要在 pointerdown 时卸载浮层，
                否则同一次点击会穿透到底下的保存/取消按钮。
              */}
              <button
                type="button"
                className="ui-datepicker__backdrop"
                aria-label="关闭日期选择"
                onClick={() => setOpen(false)}
              />
              {panel}
            </div>,
            document.body,
          )
        : open
          ? panel
          : null}
    </div>
  )
}
