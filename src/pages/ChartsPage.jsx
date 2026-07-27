import { useMemo, useState } from 'react'
import { Card } from 'animal-island-ui'
import CategoryChart from '../components/CategoryChart'
import SectionHeading from '../components/SectionHeading'
import SegmentedControl from '../components/SegmentedControl'
import { useCashbook } from '../context/CashbookContext'
import { useCyclePieData } from '../hooks/useCycleStats'
import { formatMoney } from '../lib/money'

function ChartPanel({ title, data = [], total = 0, emptyText, chartType }) {
  const slices = Array.isArray(data) ? data : []

  return (
    <Card color="app-blue" pattern="default" className="island-panel pie-panel">
      <div className="island-panel__head">
        <SectionHeading tone="blue">{title}</SectionHeading>
        <p className="island-panel__meta">¥{formatMoney(total)}</p>
      </div>

      {slices.length === 0 ? (
        <div className="pie-empty">{emptyText}</div>
      ) : (
        <>
          <CategoryChart chartType={chartType} data={slices} />
          <div className="pie-legend">
            {slices.map((item) => {
              const percent = total > 0 ? Math.round((item.value / total) * 100) : 0
              return (
                <div key={item.categoryId} className="pie-legend__item">
                  <span
                    className="pie-legend__dot"
                    style={{ background: item.fill }}
                  />
                  <span className="pie-legend__name">{item.name}</span>
                  <span className="pie-legend__value">
                    ¥{formatMoney(item.value)} · {percent}%
                  </span>
                </div>
              )
            })}
          </div>
        </>
      )}
    </Card>
  )
}

export default function ChartsPage() {
  const { state } = useCashbook()
  const chartData = useCyclePieData(
    state.transactions,
    state.categories,
    state.settings.cycleStartDay,
  )
  const [mode, setMode] = useState('expense')
  const [chartType, setChartType] = useState('pie')

  const active = useMemo(() => {
    const group = mode === 'expense' ? chartData.expense : chartData.income
    return {
      slices: group?.slices || [],
      total: group?.total || 0,
    }
  }, [mode, chartData])

  return (
    <div className="page page--charts">
      <Card color="app-yellow" pattern="default" className="island-panel charts-hero">
        <div className="island-panel__head">
          <div>
            <SectionHeading tone="yellow">收支看板</SectionHeading>
            <p className="island-panel__meta">{chartData.cycleLabel}</p>
          </div>
          <p className="island-panel__meta island-panel__meta--right">
            {chartData.cycleRange}
          </p>
        </div>

        <div className="stat-grid">
          <div className="stat-grid__item stat-grid__item--expense">
            <span>支出</span>
            <strong className="text-expense">
              ¥{formatMoney(chartData.expense?.total || 0)}
            </strong>
          </div>
          <div className="stat-grid__item stat-grid__item--income">
            <span>收入</span>
            <strong className="text-income">
              ¥{formatMoney(chartData.income?.total || 0)}
            </strong>
          </div>
          <div className="stat-grid__item stat-grid__item--balance">
            <span>结余</span>
            <strong className="text-balance">
              ¥{formatMoney(chartData.balance || 0)}
            </strong>
          </div>
        </div>

        <div className="charts-controls">
          <div className="form-field">
            <span className="form-field__label">数据类型</span>
            <SegmentedControl
              ariaLabel="数据类型"
              value={mode}
              onChange={setMode}
              options={[
                { label: '支出', value: 'expense' },
                { label: '收入', value: 'income' },
              ]}
            />
          </div>
          <div className="form-field">
            <span className="form-field__label">图表类型</span>
            <SegmentedControl
              ariaLabel="图表类型"
              value={chartType}
              onChange={setChartType}
              options={[
                { label: '饼图', value: 'pie' },
                { label: '环形', value: 'donut' },
                { label: '柱状', value: 'bar' },
              ]}
            />
          </div>
        </div>
      </Card>

      <ChartPanel
        title={mode === 'expense' ? '花在哪里' : '钱从哪来'}
        data={active.slices}
        total={active.total}
        emptyText={
          mode === 'expense' ? '本账期还没有支出记录' : '本账期还没有收入记录'
        }
        chartType={chartType}
      />
    </div>
  )
}
