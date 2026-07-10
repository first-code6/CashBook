import { useMemo, useState } from 'react'
import { Card, Tag, Title, Wallet } from 'animal-island-ui'
import AddFab from '../components/AddFab'
import CategoryChart from '../components/CategoryChart'
import SegmentedControl from '../components/SegmentedControl'
import { useCashbook } from '../context/CashbookContext'
import { useCyclePieData } from '../hooks/useCycleStats'
import { getToday } from '../lib/date'
import { formatMoney } from '../lib/money'

function ChartPanel({ title, color, data = [], total = 0, emptyText, chartType }) {
  const slices = Array.isArray(data) ? data : []

  return (
    <Card color={color} pattern="default" className="pie-panel">
      <div className="pie-panel__head">
        <Title size="middle" color={color === 'app-red' ? 'app-red' : 'app-green'}>
          {title}
        </Title>
        <Wallet value={formatMoney(total)} size="small" />
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
      <section className="section-block">
        <div className="section-title section-title--row">
          <Title size="middle" color="app-yellow">
            账期图表
          </Title>
          <Tag color="app-orange" size="small">
            {chartData.cycleRange}
          </Tag>
        </div>

        <Card color="app-yellow" pattern="default" className="charts-hero">
          <p className="charts-hero__label">{chartData.cycleLabel}</p>
          <div className="charts-hero__stats">
            <div>
              <span>支出</span>
              <strong className="text-expense">
                ¥{formatMoney(chartData.expense?.total || 0)}
              </strong>
            </div>
            <div>
              <span>收入</span>
              <strong className="text-income">
                ¥{formatMoney(chartData.income?.total || 0)}
              </strong>
            </div>
            <div>
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
                  { label: '支出分类', value: 'expense' },
                  { label: '收入分类', value: 'income' },
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
                  { label: '环形图', value: 'donut' },
                  { label: '柱状图', value: 'bar' },
                ]}
              />
            </div>
          </div>
        </Card>
      </section>

      <ChartPanel
        title={mode === 'expense' ? '支出构成' : '收入构成'}
        color={mode === 'expense' ? 'app-red' : 'app-green'}
        data={active.slices}
        total={active.total}
        emptyText={
          mode === 'expense' ? '本账期还没有支出记录' : '本账期还没有收入记录'
        }
        chartType={chartType}
      />

      <AddFab defaultDate={getToday()} />
    </div>
  )
}
