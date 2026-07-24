import { useMemo, useState } from 'react'
import { Button, Card, Modal } from 'animal-island-ui'
import AddFab from '../components/AddFab'
import MonthChart from '../components/MonthChart'
import SectionHeading from '../components/SectionHeading'
import TransactionDayList from '../components/TransactionDayList'
import TransactionForm from '../components/TransactionForm'
import { useCashbook } from '../context/CashbookContext'
import { useCycleOverview } from '../hooks/useCycleStats'
import { getCurrentCycle, isDateInRange, shiftCycle } from '../lib/billingCycle'
import { formatDayLabel, getToday } from '../lib/date'
import { formatMoney } from '../lib/money'

export default function HistoryPage() {
  const { state, deleteTransaction } = useCashbook()
  const today = getToday()
  const cycleStartDay = state.settings.cycleStartDay
  const [viewAnchor, setViewAnchor] = useState(() => getCurrentCycle(cycleStartDay, today).start)
  const [selectedDate, setSelectedDate] = useState(today)
  const [confirmId, setConfirmId] = useState('')
  const [editing, setEditing] = useState(null)

  const overview = useCycleOverview(state.transactions, cycleStartDay, viewAnchor)

  const dayItems = useMemo(() => {
    if (!selectedDate) return []
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

  const handleCycleChange = (delta) => {
    const next = shiftCycle(overview.cycle, delta, cycleStartDay)
    setViewAnchor(next.start)
    setSelectedDate((current) => {
      if (!current) return current
      return isDateInRange(current, next.start, next.end) ? current : ''
    })
  }

  return (
    <div className="page page--history">
      <MonthChart
        cycleStart={overview.cycle.start}
        cycleEnd={overview.cycle.end}
        cycleLabel={overview.cycleLabel}
        cycleRange={overview.cycleRange}
        dailyMap={overview.dailyMap}
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
        onCycleChange={handleCycleChange}
        canGoNext={overview.canGoNext}
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

          <TransactionDayList
            items={dayItems}
            categories={state.categories}
            onEdit={setEditing}
            onDelete={setConfirmId}
          />
        </Card>
      )}

      <TransactionForm
        open={Boolean(editing)}
        transaction={editing}
        onClose={() => setEditing(null)}
      />

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

      <AddFab defaultDate={selectedDate || today} />
    </div>
  )
}
