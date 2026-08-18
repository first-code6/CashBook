import { useMemo, useState } from 'react'
import { Card } from 'animal-island-ui'
import CategoryChart from '../components/CategoryChart'
import SectionHeading from '../components/SectionHeading'
import SegmentedControl from '../components/SegmentedControl'
import { useCashbook } from '../context/CashbookContext'
import { useCyclePieData } from '../hooks/useCycleStats'
import { formatMoney } from '../lib/money'

function ChartPanel({
  title,
  data = [],
  total = 0,
  emptyText,
  chartType,
  onSliceClick,
  onBack,
}) {
  const slices = Array.isArray(data) ? data : []

  return (
    <Card color="app-blue" pattern="default" className="island-panel pie-panel">
      <div className="island-panel__head">
        <div className="chart-panel__heading">
          {onBack ? (
            <button type="button" className="chart-drill-back" onClick={onBack}>
              ‹ 返回汇总
            </button>
          ) : null}
          <SectionHeading tone="blue">{title}</SectionHeading>
        </div>
        <p className="island-panel__meta">¥{formatMoney(total)}</p>
      </div>

      {slices.length === 0 ? (
        <div className="pie-empty">{emptyText}</div>
      ) : (
        <>
          <CategoryChart chartType={chartType} data={slices} onSliceClick={onSliceClick} />
          <div className="pie-legend">
            {slices.map((item) => {
              const percent = total > 0 ? Math.round((item.value / total) * 100) : 0
              const interactive = Boolean(onSliceClick && item.hasChildren)
              const content = (
                <>
                  <span
                    className="pie-legend__dot"
                    style={{ background: item.fill }}
                  />
                  <span className="pie-legend__name">{item.name}</span>
                  <span className="pie-legend__value">
                    ¥{formatMoney(item.value)} · {percent}%
                  </span>
                </>
              )

              return interactive ? (
                <button
                  key={item.categoryId}
                  type="button"
                  className="pie-legend__item pie-legend__item--interactive"
                  onClick={() => onSliceClick(item)}
                  aria-label={`查看${item.name}的子分类统计`}
                >
                  {content}
                </button>
              ) : (
                <div key={item.categoryId} className="pie-legend__item">
                  {content}
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
  const [drillRootId, setDrillRootId] = useState(null)

  const active = useMemo(() => {
    const group = mode === 'expense' ? chartData.expense : chartData.income
    const breakdown = drillRootId ? group?.breakdowns?.[drillRootId] : null

    if (breakdown) {
      return {
        slices: breakdown.slices || [],
        total: breakdown.total || 0,
        rootName: breakdown.rootName,
        drilled: true,
      }
    }

    return {
      slices: group?.slices || [],
      total: group?.total || 0,
      rootName: null,
      drilled: false,
    }
  }, [mode, chartData, drillRootId])

  const handleModeChange = (nextMode) => {
    setMode(nextMode)
    setDrillRootId(null)
  }

  const handleSliceClick = (item) => {
    if (item?.hasChildren) setDrillRootId(item.categoryId)
  }

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
              onChange={handleModeChange}
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
        title={
          active.drilled
            ? `${active.rootName} · 子分类`
            : mode === 'expense'
              ? '花在哪里'
              : '钱从哪来'
        }
        data={active.slices}
        total={active.total}
        emptyText={
          mode === 'expense' ? '本账期还没有支出记录' : '本账期还没有收入记录'
        }
        chartType={chartType}
        onSliceClick={active.drilled ? undefined : handleSliceClick}
        onBack={active.drilled ? () => setDrillRootId(null) : undefined}
      />
    </div>
  )
}
