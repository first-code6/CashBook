import { useMemo, useState } from 'react'
import { Button, Card, Tag, Title } from 'animal-island-ui'
import AddFab from '../components/AddFab'
import MonthChart from '../components/MonthChart'
import { useCashbook } from '../context/CashbookContext'
import { useCycleOverview } from '../hooks/useCycleStats'
import { formatDayLabel, getToday } from '../lib/date'
import { formatMoney } from '../lib/money'

export default function HistoryPage() {
  const { state, deleteTransaction } = useCashbook()
  const overview = useCycleOverview(
    state.transactions,
    state.settings.cycleStartDay,
  )
  const [selectedDate, setSelectedDate] = useState(getToday())

  const categoryMap = useMemo(
    () => Object.fromEntries(state.categories.map((item) => [item.id, item.name])),
    [state.categories],
  )

  const dayItems = useMemo(() => {
    return state.transactions
      .filter((item) => item.date === selectedDate)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }, [state.transactions, selectedDate])

  const daySummary = useMemo(() => {
    const income = dayItems
      .filter((item) => item.type === 'income')
      .reduce((sum, item) => sum + item.amount, 0)
    const expense = dayItems
      .filter((item) => item.type === 'expense')
      .reduce((sum, item) => sum + item.amount, 0)
    return { income, expense, count: dayItems.length }
  }, [dayItems])

  const handleSelectDate = (date) => {
    setSelectedDate((current) => (current === date ? '' : date))
  }

  return (
    <div className="page page--history">
      <MonthChart
        cycleStart={overview.cycle.start}
        cycleEnd={overview.cycle.end}
        dailyMap={overview.dailyMap}
        cycleRange={overview.cycleRange}
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
      />

      {selectedDate && (
        <section className="section-block day-detail">
          <div className="section-title section-title--stack">
            <Title size="middle" color="app-orange">
              {formatDayLabel(selectedDate)}
            </Title>
            <Tag color="app-yellow" size="small">
              {daySummary.count} 笔 · 支 ¥{formatMoney(daySummary.expense)} · 收 ¥
              {formatMoney(daySummary.income)}
            </Tag>
          </div>

          <Card className="day-detail__card">
            {dayItems.length === 0 ? (
              <p className="history-day__empty">这一天没有记录</p>
            ) : (
              <div className="day-detail__list">
                {dayItems.map((item) => (
                  <div key={item.id} className="history-item">
                    <div>
                      <p className="history-item__category">
                        {categoryMap[item.categoryId] || '未分类'}
                        <Tag
                          size="small"
                          color={item.type === 'income' ? 'app-green' : 'app-red'}
                        >
                          {item.type === 'income' ? '收入' : '支出'}
                        </Tag>
                      </p>
                      <p className="history-item__note">{item.note || '无备注'}</p>
                    </div>
                    <div className="history-item__side">
                      <strong
                        className={
                          item.type === 'income' ? 'text-income' : 'text-expense'
                        }
                      >
                        {item.type === 'income' ? '+' : '-'}
                        {formatMoney(item.amount)}
                      </strong>
                      <Button
                        size="small"
                        danger
                        onClick={() => deleteTransaction(item.id)}
                      >
                        删除
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </section>
      )}

      <AddFab defaultDate={selectedDate || getToday()} />
    </div>
  )
}
