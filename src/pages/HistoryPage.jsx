import { useMemo, useState } from 'react'
import { Button, Card, Tag, Title, Wallet } from 'animal-island-ui'
import AddFab from '../components/AddFab'
import { useCashbook } from '../context/CashbookContext'
import { useHistoryOverview } from '../hooks/useCycleStats'
import { formatDayLabel, getToday } from '../lib/date'
import { formatMoney } from '../lib/money'

export default function HistoryPage() {
  const { state, deleteTransaction } = useCashbook()
  const history = useHistoryOverview(
    state.transactions,
    state.settings.cycleStartDay,
  )
  const [expanded, setExpanded] = useState(getToday())

  const categoryMap = useMemo(
    () => Object.fromEntries(state.categories.map((item) => [item.id, item.name])),
    [state.categories],
  )

  return (
    <div className="page page--history">
      <section className="section-block">
        <div className="section-title section-title--row">
          <Title size="middle" color="app-orange">
            历史概括
          </Title>
          <Tag color="app-yellow" size="small">
            今天 → 账期开始
          </Tag>
        </div>

        <Card color="app-orange" pattern="default" className="history-summary">
          <div className="history-summary__item">
            <span>区间支出</span>
            <Wallet value={formatMoney(history.expense)} size="small" />
          </div>
          <div className="history-summary__item">
            <span>区间收入</span>
            <Wallet value={formatMoney(history.income)} size="small" />
          </div>
          <div className="history-summary__item">
            <span>覆盖区间</span>
            <strong className="history-summary__range">{history.rangeLabel}</strong>
          </div>
        </Card>
      </section>

      <div className="history-list">
        {history.days.map((day) => (
          <Card key={day.date} className="history-day">
            <button
              type="button"
              className="history-day__header"
              onClick={() =>
                setExpanded((current) => (current === day.date ? '' : day.date))
              }
            >
              <div>
                <p className="history-day__title">{formatDayLabel(day.date)}</p>
                <p className="history-day__meta">
                  {day.count} 笔 · 收入 ¥{formatMoney(day.income)}
                </p>
              </div>
              <div className="history-day__expense">
                <span>支出</span>
                <strong>¥{formatMoney(day.expense)}</strong>
              </div>
            </button>

            {expanded === day.date && (
              <div className="history-day__body">
                {day.items.length === 0 ? (
                  <p className="history-day__empty">这一天没有记录</p>
                ) : (
                  day.items.map((item) => (
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
                        <p className="history-item__note">
                          {item.note || '无备注'}
                        </p>
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
                  ))
                )}
              </div>
            )}
          </Card>
        ))}
      </div>

      <AddFab defaultDate={getToday()} />
    </div>
  )
}
