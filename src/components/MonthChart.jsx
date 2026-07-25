import { Card, Tag } from 'animal-island-ui'
import SectionHeading from './SectionHeading'
import { formatCompactMoney, getToday } from '../lib/date'
import { useCycleCalendarDays } from '../hooks/useCycleStats'

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日']

export default function MonthChart({
  cycleStart,
  cycleEnd,
  cycleLabel,
  cycleRange,
  dailyMap,
  selectedDate,
  onSelectDate,
  onCycleChange,
  canGoNext = true,
}) {
  const cells = useCycleCalendarDays(cycleStart, cycleEnd, dailyMap)
  const today = getToday()

  return (
    <Card color="app-orange" pattern="default" className="island-panel month-chart">
      <div className="island-panel__head">
        <div>
          <SectionHeading tone="orange">每日一览</SectionHeading>
          <div className="month-nav" role="group" aria-label="切换账期">
            <button
              type="button"
              className="month-nav__btn"
              onClick={() => onCycleChange?.(-1)}
              aria-label="上一账期"
            >
              ‹
            </button>
            <div className="month-nav__copy">
              <span className="month-nav__label">{cycleLabel}</span>
              <span className="month-nav__range">{cycleRange}</span>
            </div>
            <button
              type="button"
              className="month-nav__btn"
              onClick={() => onCycleChange?.(1)}
              disabled={!canGoNext}
              aria-label="下一账期"
            >
              ›
            </button>
          </div>
        </div>
        <div className="calendar-legend">
          <Tag color="app-red" size="small">
            支出
          </Tag>
          <Tag color="app-teal" size="small">
            收入
          </Tag>
        </div>
      </div>

      <div className="calendar-weekdays">
        {WEEKDAYS.map((label) => (
          <div key={label} className="calendar-weekday">
            {label}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {cells.map((cell) => {
          if (cell.empty) {
            return <div key={cell.key} className="calendar-cell calendar-cell--empty" />
          }

          const isToday = cell.date === today
          const isSelected = cell.date === selectedDate
          const hasExpense = cell.expense > 0
          const hasIncome = cell.income > 0

          return (
            <button
              key={cell.key}
              type="button"
              className={[
                'calendar-cell',
                'calendar-cell--interactive',
                isToday ? 'calendar-cell--today' : '',
                isSelected ? 'calendar-cell--selected' : '',
                hasExpense || hasIncome ? 'calendar-cell--has-data' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onSelectDate?.(cell.date)}
              aria-pressed={isSelected}
            >
              <span className="calendar-cell__day">{cell.day}</span>
              <span
                className={`calendar-cell__amount${
                  hasExpense ? ' calendar-cell__amount--expense' : ''
                }`}
              >
                {hasExpense ? `-${formatCompactMoney(cell.expense)}` : '·'}
              </span>
              <span
                className={`calendar-cell__amount${
                  hasIncome ? ' calendar-cell__amount--income' : ''
                }`}
              >
                {hasIncome ? `+${formatCompactMoney(cell.income)}` : ''}
              </span>
            </button>
          )
        })}
      </div>
    </Card>
  )
}
