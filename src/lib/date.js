export function getToday() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function toMonthKey(dateKey = getToday()) {
  return String(dateKey || getToday()).slice(0, 7)
}

export function shiftMonth(month, delta) {
  const [year, monthValue] = month.split('-').map(Number)
  const base = new Date(year, monthValue - 1 + delta, 1)
  const nextYear = base.getFullYear()
  const nextMonth = String(base.getMonth() + 1).padStart(2, '0')
  return `${nextYear}-${nextMonth}`
}

export function getMonthBounds(month) {
  const days = getDaysInMonth(month)
  return {
    start: buildDateKey(month, 1),
    end: buildDateKey(month, days),
  }
}

export function formatMonthLabel(month) {
  const [year, monthValue] = month.split('-')
  return `${year}年${Number(monthValue)}月`
}

export function getDaysInMonth(month) {
  const [year, monthValue] = month.split('-').map(Number)
  return new Date(year, monthValue, 0).getDate()
}

export function getMonthStartWeekday(month) {
  const [year, monthValue] = month.split('-').map(Number)
  // 0 = Sunday ... 6 = Saturday; convert to Monday-first (0 = Monday)
  const sundayFirst = new Date(year, monthValue - 1, 1).getDay()
  return (sundayFirst + 6) % 7
}

export function buildDateKey(month, day) {
  return `${month}-${String(day).padStart(2, '0')}`
}

export function formatDayLabel(dateKey) {
  const today = getToday()
  if (dateKey === today) return '今天'

  const [, month, day] = dateKey.split('-')
  return `${Number(month)} 月 ${Number(day)} 日`
}

export function formatCompactMoney(fen) {
  const yuan = fen / 100
  if (yuan >= 10000) {
    return `${(yuan / 10000).toFixed(1)}万`
  }
  if (yuan >= 1000) {
    return yuan.toFixed(0)
  }
  if (Number.isInteger(yuan)) {
    return String(yuan)
  }
  return yuan.toFixed(yuan < 10 ? 1 : 0)
}
