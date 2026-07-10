import { Card, Progress, Tag, Title, Wallet } from 'animal-island-ui'
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
    <section className="section-block overview-block">
      <div className="section-title section-title--stack">
        <Title size="middle" color="app-green">
          总概括
        </Title>
        <Tag color="app-teal" size="small">
          {cycleLabel}
        </Tag>
      </div>

      <Card color="app-green" pattern="default" className="overview-hero">
        <div className="overview-hero__ribbon">{cycleRange}</div>

        <div className="overview-hero__top">
          <div>
            <p className="overview-hero__eyebrow">本账期支出</p>
            <Wallet value={formatMoney(expense)} size="large" />
          </div>
          <div className="overview-hero__meta">
            <Tag color="app-yellow" size="small">
              {count} 笔
            </Tag>
            <Tag color="warm-peach-pink" size="small">
              进度 {progress}%
            </Tag>
          </div>
        </div>

        <div className="overview-stats">
          <div className="overview-stats__item overview-stats__item--income">
            <span>收入</span>
            <strong className="text-income">¥{formatMoney(income)}</strong>
          </div>
          <div className="overview-stats__item overview-stats__item--balance">
            <span>结余</span>
            <strong className="text-balance">¥{formatMoney(balance)}</strong>
          </div>
          <div className="overview-stats__item">
            <span>账期进度</span>
            <strong>{progress}%</strong>
          </div>
        </div>

        <Progress
          percent={progress}
          size="large"
          infoPosition="inside"
          infoFormat={(value) => `${value}%`}
        />
      </Card>
    </section>
  )
}
