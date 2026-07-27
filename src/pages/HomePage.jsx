import { useMemo, useState } from 'react'
import { Button, Card, Modal } from 'animal-island-ui'
import AddFab from '../components/AddFab'
import CycleOverview from '../components/CycleOverview'
import SectionHeading from '../components/SectionHeading'
import TransactionDayList from '../components/TransactionDayList'
import TransactionForm from '../components/TransactionForm'
import { useCashbook } from '../context/CashbookContext'
import { useCycleOverview } from '../hooks/useCycleStats'
import { getToday } from '../lib/date'
import { formatMoney } from '../lib/money'

export default function HomePage() {
  const { state, deleteTransaction } = useCashbook()
  const overview = useCycleOverview(
    state.transactions,
    state.settings.cycleStartDay,
  )
  const today = getToday()
  const [confirmId, setConfirmId] = useState('')
  const [editing, setEditing] = useState(null)

  const todayItems = useMemo(() => {
    return state.transactions
      .filter((item) => item.date === today)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }, [state.transactions, today])

  const todaySummary = useMemo(() => {
    const income = todayItems
      .filter((item) => item.type === 'income')
      .reduce((sum, item) => sum + item.amount, 0)
    const expense = todayItems
      .filter((item) => item.type === 'expense')
      .reduce((sum, item) => sum + item.amount, 0)
    return { income, expense, count: todayItems.length }
  }, [todayItems])

  return (
    <div className="page page--home">
      <CycleOverview
        cycleLabel={overview.cycleLabel}
        cycleRange={overview.cycleRange}
        income={overview.income}
        expense={overview.expense}
        balance={overview.balance}
        count={overview.count}
        progress={overview.progress}
        todayExpense={overview.todayExpense}
        todayCount={overview.todayCount}
      />

      <Card color="app-yellow" pattern="default" className="island-panel day-detail">
        <div className="island-panel__head">
          <div>
            <SectionHeading tone="yellow">今日明细</SectionHeading>
            <p className="island-panel__meta">
              {todaySummary.count} 笔 · 支 ¥{formatMoney(todaySummary.expense)} · 收 ¥
              {formatMoney(todaySummary.income)}
            </p>
          </div>
        </div>

        {todayItems.length === 0 ? (
          <p className="empty-text">今天还没有记录，点下方按钮记一笔吧。</p>
        ) : null}
        <TransactionDayList
          key={today}
          items={todayItems}
          categories={state.categories}
          onEdit={setEditing}
          onDelete={setConfirmId}
          emptyText=""
        />
      </Card>

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

      <AddFab defaultDate={today} />
    </div>
  )
}
