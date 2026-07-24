import { Button, Tag } from 'animal-island-ui'
import CategoryIcon from './CategoryIcon'
import { getCategoryIconName, getCategoryPathLabel } from '../lib/categories'
import { formatMoney } from '../lib/money'

/** 单日流水列表：支持点击编辑、删除 */
export default function TransactionDayList({ items, categories, onEdit, onDelete }) {
  if (items.length === 0) {
    return <p className="empty-text">这一天没有记录</p>
  }

  return (
    <div className="day-detail__list">
      {items.map((item) => (
        <div key={item.id} className="history-item">
          <button
            type="button"
            className="history-item__main"
            onClick={() => onEdit?.(item)}
            aria-label="编辑记录"
          >
            <p className="history-item__category">
              <CategoryIcon
                name={getCategoryIconName(categories, item.categoryId)}
                size={24}
              />
              {getCategoryPathLabel(categories, item.categoryId)}
              <Tag color={item.type === 'income' ? 'app-teal' : 'app-red'} size="small">
                {item.type === 'income' ? '收入' : '支出'}
              </Tag>
            </p>
            <p className="history-item__note">{item.note || '无备注'}</p>
          </button>
          <div className="history-item__side">
            <strong className={item.type === 'income' ? 'text-income' : 'text-expense'}>
              {item.type === 'income' ? '+' : '-'}
              {formatMoney(item.amount)}
            </strong>
            <div className="history-item__actions">
              <Button size="small" onClick={() => onEdit?.(item)}>
                编辑
              </Button>
              <Button size="small" danger onClick={() => onDelete?.(item.id)}>
                删除
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
