import { Button, Card, Title } from 'animal-island-ui'
import { formatMoney } from '../lib/money'

export default function TransactionList({ items, categories, onDelete }) {
  const categoryMap = Object.fromEntries(categories.map((item) => [item.id, item.name]))

  if (items.length === 0) {
    return (
      <Card className="empty-state">
        <p>这个月还没有记录，点下方按钮记一笔吧。</p>
      </Card>
    )
  }

  return (
    <section className="section-block">
      <div className="section-title">
        <Title size="middle" color="app-orange">
          本月流水
        </Title>
      </div>
      <div className="transaction-list">
        {items.map((item) => (
          <Card key={item.id} className="transaction-item">
            <div className="transaction-item__main">
              <p className="transaction-item__category">
                {categoryMap[item.categoryId] || '未分类'}
              </p>
              <p className="transaction-item__meta">
                {item.date}
                {item.note ? ` · ${item.note}` : ''}
              </p>
            </div>
            <div className="transaction-item__side">
              <p
                className={`transaction-item__amount transaction-item__amount--${item.type}`}
              >
                {item.type === 'income' ? '+' : '-'}
                {formatMoney(item.amount)}
              </p>
              <Button size="small" danger onClick={() => onDelete(item.id)}>
                删除
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
