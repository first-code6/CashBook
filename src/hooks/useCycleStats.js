import { useMemo } from 'react'
import {
  formatCycleLabel,
  formatCycleRange,
  getCurrentCycle,
  getCycleProgress,
  isDateInRange,
  listDatesDescending,
  listDatesInclusive,
} from '../lib/billingCycle'
import { getCategoryPathLabel } from '../lib/categories'
import { getToday } from '../lib/date'

function summarize(items) {
  const income = items
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0)

  const expense = items
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0)

  return {
    income,
    expense,
    balance: income - expense,
    count: items.length,
  }
}

function getWeekdayMondayFirst(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const sundayFirst = new Date(year, month - 1, day).getDay()
  return (sundayFirst + 6) % 7
}

export function useCycleOverview(transactions, cycleStartDay) {
  return useMemo(() => {
    const today = getToday()
    const cycle = getCurrentCycle(cycleStartDay, today)
    const items = transactions.filter((item) =>
      isDateInRange(item.date, cycle.start, cycle.end),
    )
    const summary = summarize(items)

    const dailyMap = {}
    for (const date of listDatesInclusive(cycle.start, cycle.end)) {
      dailyMap[date] = { income: 0, expense: 0 }
    }
    for (const item of items) {
      if (!dailyMap[item.date]) {
        dailyMap[item.date] = { income: 0, expense: 0 }
      }
      dailyMap[item.date][item.type] += item.amount
    }

    return {
      today,
      cycle,
      cycleLabel: formatCycleLabel(cycle),
      cycleRange: formatCycleRange(cycle),
      progress: getCycleProgress(cycle, today),
      items,
      dailyMap,
      ...summary,
    }
  }, [transactions, cycleStartDay])
}

export function useHistoryOverview(transactions, cycleStartDay) {
  return useMemo(() => {
    const today = getToday()
    const cycle = getCurrentCycle(cycleStartDay, today)
    const historyStart = cycle.start
    const dates = listDatesDescending(historyStart, today)

    const rangeItems = transactions.filter((item) =>
      isDateInRange(item.date, historyStart, today),
    )

    const byDate = {}
    for (const date of dates) {
      byDate[date] = []
    }
    for (const item of rangeItems) {
      if (!byDate[item.date]) byDate[item.date] = []
      byDate[item.date].push(item)
    }

    const days = dates.map((date) => {
      const dayItems = (byDate[date] || []).sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      )
      return {
        date,
        items: dayItems,
        ...summarize(dayItems),
      }
    })

    return {
      today,
      historyStart,
      rangeLabel: `${historyStart} ~ ${today}`,
      days,
      ...summarize(rangeItems),
    }
  }, [transactions, cycleStartDay])
}

export function useCycleCalendarDays(cycleStart, cycleEnd, dailyMap) {
  return useMemo(() => {
    const dates = listDatesInclusive(cycleStart, cycleEnd)
    const startWeekday = getWeekdayMondayFirst(cycleStart)
    const cells = []

    for (let i = 0; i < startWeekday; i += 1) {
      cells.push({ key: `empty-${i}`, empty: true })
    }

    for (const date of dates) {
      const day = Number(date.slice(-2))
      const stats = dailyMap[date] || { income: 0, expense: 0 }
      cells.push({
        key: date,
        empty: false,
        day,
        date,
        income: stats.income,
        expense: stats.expense,
      })
    }

    return cells
  }, [cycleStart, cycleEnd, dailyMap])
}

const PIE_COLORS = [
  '#F4A261',
  '#E76F51',
  '#2A9D8F',
  '#E9C46A',
  '#264653',
  '#8ECAE6',
  '#FB8500',
  '#90BE6D',
  '#F72585',
  '#4CC9F0',
  '#B5838D',
  '#6D6875',
]

export function useCyclePieData(transactions, categories, cycleStartDay) {
  return useMemo(() => {
    const today = getToday()
    const cycle = getCurrentCycle(cycleStartDay, today)
    const items = transactions.filter((item) =>
      isDateInRange(item.date, cycle.start, cycle.end),
    )

    const buildSlices = (type) => {
      const totals = {}
      for (const item of items) {
        if (item.type !== type) continue
        totals[item.categoryId] = (totals[item.categoryId] || 0) + item.amount
      }

      const slices = Object.entries(totals)
        .map(([categoryId, value], index) => ({
          categoryId,
          name: getCategoryPathLabel(categories, categoryId),
          value,
          fill: PIE_COLORS[index % PIE_COLORS.length],
        }))
        .sort((a, b) => b.value - a.value)

      const total = slices.reduce((sum, item) => sum + item.value, 0)
      return { slices, total }
    }

    const summary = summarize(items)

    return {
      cycle,
      cycleLabel: formatCycleLabel(cycle),
      cycleRange: formatCycleRange(cycle),
      expense: buildSlices('expense'),
      income: buildSlices('income'),
      balance: summary.balance,
      count: summary.count,
      totalIncome: summary.income,
      totalExpense: summary.expense,
    }
  }, [transactions, categories, cycleStartDay])
}
