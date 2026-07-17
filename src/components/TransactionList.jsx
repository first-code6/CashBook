import { Button, Card } from 'animal-island-ui'
import SectionHeading from './SectionHeading'
import { formatMoney } from '../lib/money'

export default function TransactionList({ items, categories, onDelete }) {
  const categoryMap = Object.fromEntries(categories.map((item) => [item.id, item.name]))

  if (items.length === 0) {
    return (
      <Card className="island-panel">
        <p className="empty-text">这个月还没有记录，点下方按钮记一笔吧。</p>
      </Card>
    )
  }

  return (
    <Card color="app-orange" pattern="default" className="island-panel">
      <div className="island-panel__head">
        <SectionHeading tone="orange">最近流水</SectionHeading>
      </div>
      <div className="transaction-list">
        {items.map((item) => (
          <div key={item.id} className="history-item">
            <div>
              <p className="history-item__category">
                {categoryMap[item.categoryId] || '未分类'}
              </p>
              <p className="history-item__note">
                {item.date}
                {item.note ? ` · ${item.note}` : ''}
              </p>
            </div>
            <div className="history-item__side">
              <strong className={item.type === 'income' ? 'text-income' : 'text-expense'}>
                {item.type === 'income' ? '+' : '-'}
                {formatMoney(item.amount)}
              </strong>
              <Button size="small" danger onClick={() => onDelete(item.id)}>
                删除
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
