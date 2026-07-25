import { getToday } from './date'

function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function toDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function clampDay(year, monthIndex, day) {
  const maxDay = new Date(year, monthIndex + 1, 0).getDate()
  return Math.min(day, maxDay)
}

function buildCycleDate(year, monthIndex, day) {
  return new Date(year, monthIndex, clampDay(year, monthIndex, day))
}

export function normalizeCycleStartDay(value) {
  const day = Number(value)
  if (!Number.isFinite(day)) return 1
  const rounded = Math.round(day)
  if (rounded < 1) return 1
  if (rounded > 28) return 28
  return rounded
}

/**
 * Billing cycle starts on `cycleStartDay` each month and ends the day before
 * the next start. Example: startDay=10 → Jul 10 ~ Aug 9.
 */
export function getCycleContaining(dateKey, cycleStartDay) {
  const startDay = normalizeCycleStartDay(cycleStartDay)
  const date = parseDateKey(dateKey)
  const year = date.getFullYear()
  const monthIndex = date.getMonth()
  const day = date.getDate()

  let start
  let end

  if (day >= startDay) {
    start = buildCycleDate(year, monthIndex, startDay)
    end = buildCycleDate(year, monthIndex + 1, startDay)
    end.setDate(end.getDate() - 1)
  } else {
    start = buildCycleDate(year, monthIndex - 1, startDay)
    end = buildCycleDate(year, monthIndex, startDay)
    end.setDate(end.getDate() - 1)
  }

  return {
    start: toDateKey(start),
    end: toDateKey(end),
  }
}

export function getCurrentCycle(cycleStartDay, today = getToday()) {
  return getCycleContaining(today, cycleStartDay)
}

export function getPreviousCycleStart(cycleStartDay, today = getToday()) {
  const current = getCurrentCycle(cycleStartDay, today)
  const start = parseDateKey(current.start)
  start.setMonth(start.getMonth() - 1)
  const day = normalizeCycleStartDay(cycleStartDay)
  return toDateKey(
    buildCycleDate(start.getFullYear(), start.getMonth(), day),
  )
}

/** 相对某账期前后移动 delta 个账期（通常为 ±1） */
export function shiftCycle(cycle, delta, cycleStartDay) {
  const start = parseDateKey(cycle.start)
  start.setMonth(start.getMonth() + delta)
  const day = normalizeCycleStartDay(cycleStartDay)
  const anchor = toDateKey(
    buildCycleDate(start.getFullYear(), start.getMonth(), day),
  )
  return getCycleContaining(anchor, cycleStartDay)
}

export function formatCycleRange(cycle) {
  const format = (dateKey) => {
    const [, month, day] = dateKey.split('-')
    return `${Number(month)}/${Number(day)}`
  }
  return `${format(cycle.start)} - ${format(cycle.end)}`
}

export function formatCycleLabel(cycle) {
  const [startYear, startMonth] = cycle.start.split('-')
  return `${startYear}年${Number(startMonth)}月账期`
}

export function listDatesInclusive(startKey, endKey) {
  const dates = []
  const cursor = parseDateKey(startKey)
  const end = parseDateKey(endKey)

  while (cursor <= end) {
    dates.push(toDateKey(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }

  return dates
}

export function listDatesDescending(startKey, endKey) {
  return listDatesInclusive(startKey, endKey).reverse()
}

export function isDateInRange(dateKey, startKey, endKey) {
  return dateKey >= startKey && dateKey <= endKey
}

export function getCycleProgress(cycle, today = getToday()) {
  const dates = listDatesInclusive(cycle.start, cycle.end)
  if (dates.length === 0) return 0

  const clamped = today < cycle.start ? cycle.start : today > cycle.end ? cycle.end : today
  const index = dates.indexOf(clamped)
  return Math.round(((index + 1) / dates.length) * 100)
}
