import { Card, Tag, Title } from 'animal-island-ui'
import { formatCompactMoney, getToday } from '../lib/date'
import { useCycleCalendarDays } from '../hooks/useCycleStats'

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日']

export default function MonthChart({ cycleStart, cycleEnd, dailyMap, cycleRange }) {
  const cells = useCycleCalendarDays(cycleStart, cycleEnd, dailyMap)
  const today = getToday()

  return (
    <section className="section-block month-chart">
      <div className="section-title section-title--row">
        <Title size="middle" color="app-teal">
          月图
        </Title>
        <Tag color="app-orange" size="small">
          {cycleRange}
        </Tag>
      </div>

      <Card color="warm-peach-pink" pattern="default" className="calendar-card">
        <div className="calendar-legend">
          <span className="calendar-legend__item calendar-legend__item--expense">
            支出
          </span>
          <span className="calendar-legend__item calendar-legend__item--income">
            收入
          </span>
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
            const hasExpense = cell.expense > 0
            const hasIncome = cell.income > 0

            return (
              <div
                key={cell.key}
                className={[
                  'calendar-cell',
                  'calendar-cell--static',
                  'calendar-cell--in-cycle',
                  isToday ? 'calendar-cell--today' : '',
                  hasExpense || hasIncome ? 'calendar-cell--has-data' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
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
              </div>
            )
          })}
        </div>
      </Card>
    </section>
  )
}
