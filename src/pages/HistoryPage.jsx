import { useMemo, useState } from 'react'
import { Button, Card, Modal, Tag } from 'animal-island-ui'
import AddFab from '../components/AddFab'
import MonthChart from '../components/MonthChart'
import SectionHeading from '../components/SectionHeading'
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
  const [confirmId, setConfirmId] = useState('')

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
        <Card color="app-yellow" pattern="default" className="island-panel day-detail">
          <div className="island-panel__head">
            <div>
              <SectionHeading tone="yellow">当日明细</SectionHeading>
              <p className="island-panel__meta">
                {formatDayLabel(selectedDate)} · {daySummary.count} 笔 · 支 ¥
                {formatMoney(daySummary.expense)} · 收 ¥{formatMoney(daySummary.income)}
              </p>
            </div>
          </div>

          {dayItems.length === 0 ? (
            <p className="empty-text">这一天没有记录</p>
          ) : (
            <div className="day-detail__list">
              {dayItems.map((item) => (
                <div key={item.id} className="history-item">
                  <div>
                    <p className="history-item__category">
                      {categoryMap[item.categoryId] || '未分类'}
                      <Tag
                        color={item.type === 'income' ? 'app-teal' : 'app-red'}
                        size="small"
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
                    <Button size="small" danger onClick={() => setConfirmId(item.id)}>
                      删除
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      <Modal
        open={Boolean(confirmId)}
        title="删除记录"
        typewriter={false}
        onClose={() => setConfirmId('')}
        footer={
          <div className="form-actions">
            <Button onClick={() => setConfirmId('')}>取消</Button>
            <Button
              type="primary"
              danger
              onClick={() => {
                deleteTransaction(confirmId)
                setConfirmId('')
              }}
            >
              删除
            </Button>
          </div>
        }
      >
        <p>确认删除这条记录？</p>
      </Modal>

      <AddFab defaultDate={selectedDate || getToday()} />
    </div>
  )
}
