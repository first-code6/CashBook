import { Card, Tag } from 'animal-island-ui'
import SectionHeading from './SectionHeading'
import { formatMoney } from '../lib/money'

export default function CycleOverview({
  cycleLabel,
  cycleRange,
  income,
  expense,
  balance,
  count,
  progress,
}) {
  return (
    <Card color="app-teal" pattern="default" className="island-panel overview">
      <div className="island-panel__head">
        <div>
          <SectionHeading tone="teal">账期概览</SectionHeading>
          <p className="island-panel__meta">{cycleLabel}</p>
        </div>
        <Tag color="app-orange" size="small">
          {cycleRange}
        </Tag>
      </div>

      <div className="overview__hero">
        <div>
          <p className="overview__label">本账期支出</p>
          <p className="overview__amount text-expense">¥{formatMoney(expense)}</p>
        </div>
        <div className="overview__chips">
          <Tag color="app-yellow" size="small">
            {count} 笔
          </Tag>
          <Tag color="app-blue" size="small">
            {progress}%
          </Tag>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-grid__item stat-grid__item--income">
          <span>收入</span>
          <strong className="text-income">¥{formatMoney(income)}</strong>
        </div>
        <div className="stat-grid__item stat-grid__item--balance">
          <span>结余</span>
          <strong className="text-balance">¥{formatMoney(balance)}</strong>
        </div>
        <div className="stat-grid__item">
          <span>进度</span>
          <strong>{progress}%</strong>
        </div>
      </div>

      <div className="progress" aria-label={`账期进度 ${progress}%`}>
        <div className="progress__bar" style={{ width: `${Math.min(progress, 100)}%` }} />
      </div>
    </Card>
  )
}
