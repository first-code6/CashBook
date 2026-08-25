import { useMemo, useState } from 'react'
import { Card, Tag } from 'animal-island-ui'
import CategoryChart from '../components/CategoryChart'
import CategoryIcon from '../components/CategoryIcon'
import SectionHeading from '../components/SectionHeading'
import SegmentedControl from '../components/SegmentedControl'
import { useCashbook } from '../context/CashbookContext'
import { useCyclePieData } from '../hooks/useCycleStats'
import { getBranchTransactions } from '../lib/categoryChartData'
import { getCategoryIconName, getCategoryPathLabel } from '../lib/categories'
import { formatDayLabel } from '../lib/date'
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
              ‹ 返回
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
              const interactive = Boolean(
                onSliceClick && (item.hasChildren || item.drillable),
              )
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
                  aria-label={`查看${item.name}的明细`}
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

function BranchTransactionsPanel({ title, items, categories, onBack }) {
  return (
    <Card color="app-blue" pattern="default" className="island-panel pie-panel">
      <div className="island-panel__head">
        <div className="chart-panel__heading">
          <button type="button" className="chart-drill-back" onClick={onBack}>
            ‹ 返回子分类
          </button>
          <SectionHeading tone="blue">{title}</SectionHeading>
        </div>
        <p className="island-panel__meta">{items.length} 笔</p>
      </div>

      {items.length === 0 ? (
        <div className="pie-empty">没有记录</div>
      ) : (
        <div className="branch-tx-list">
          {items.map((item) => (
            <div key={item.id} className="history-item branch-tx-list__item">
              <div className="history-item__main" style={{ cursor: 'default' }}>
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
                <p className="history-item__note">
                  {formatDayLabel(item.date)}
                  {item.note ? ` · ${item.note}` : ' · 无备注'}
                </p>
              </div>
              <div className="history-item__side">
                <strong className={item.type === 'income' ? 'text-income' : 'text-expense'}>
                  {item.type === 'income' ? '+' : '-'}
                  {formatMoney(item.amount)}
                </strong>
              </div>
            </div>
          ))}
        </div>
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
  const [drillBranchId, setDrillBranchId] = useState(null)

  const group = useMemo(
    () => (mode === 'expense' ? chartData.expense : chartData.income),
    [mode, chartData],
  )

  const breakdown = drillRootId ? group?.breakdowns?.[drillRootId] : null

  const branchTransactions = useMemo(() => {
    if (!drillRootId || !drillBranchId) return []
    return getBranchTransactions(
      state.transactions,
      state.categories,
      mode,
      drillRootId,
      drillBranchId,
    )
  }, [state.transactions, state.categories, mode, drillRootId, drillBranchId])

  const handleModeChange = (nextMode) => {
    setMode(nextMode)
    setDrillRootId(null)
    setDrillBranchId(null)
  }

  const handleSliceClick = (item) => {
    if (item?.hasChildren) setDrillRootId(item.categoryId)
  }

  const handleBranchClick = (item) => {
    setDrillBranchId(item.categoryId)
  }

  const handleBackToRoot = () => {
    setDrillRootId(null)
    setDrillBranchId(null)
  }

  const handleBackToBranch = () => {
    setDrillBranchId(null)
  }

  let panelTitle
  let panelData
  let panelTotal
  let panelOnSliceClick
  let panelOnBack
  let showBranchPanel = false

  if (drillRootId && drillBranchId) {
    showBranchPanel = true
    const branchSlice = breakdown?.slices?.find((s) => s.categoryId === drillBranchId)
    panelTitle = `${breakdown?.rootName || ''} · ${branchSlice?.name || '明细'}`
  } else if (drillRootId) {
    panelTitle = `${breakdown?.rootName || ''} · 子分类`
    panelData = breakdown?.slices || []
    panelTotal = breakdown?.total || 0
    panelOnSliceClick = handleBranchClick
    panelOnBack = handleBackToRoot
  } else {
    panelTitle = mode === 'expense' ? '花在哪里' : '钱从哪来'
    panelData = group?.slices || []
    panelTotal = group?.total || 0
    panelOnSliceClick = handleSliceClick
    panelOnBack = undefined
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

      {showBranchPanel ? (
        <BranchTransactionsPanel
          title={panelTitle}
          items={branchTransactions}
          categories={state.categories}
          onBack={handleBackToBranch}
        />
      ) : (
        <ChartPanel
          title={panelTitle}
          data={panelData}
          total={panelTotal}
          emptyText={
            mode === 'expense' ? '本账期还没有支出记录' : '本账期还没有收入记录'
          }
          chartType={chartType}
          onSliceClick={panelOnSliceClick}
          onBack={panelOnBack}
        />
      )}
    </div>
  )
}
