import { useEffect, useRef, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatSharePercent, getCategoryChartLayout } from '../lib/chartLayout'
import { formatMoney } from '../lib/money'

const RADIAN = Math.PI / 180

function getPieRadii(size, chartType) {
  const outer = Math.min(size.width, size.height) * (size.isCompact ? 0.32 : 0.3)
  const inner = chartType === 'donut' ? outer * 0.58 : 0
  return { inner, outer }
}

function ShareLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  chartType,
}) {
  if (
    cx == null ||
    cy == null ||
    midAngle == null ||
    percent == null ||
    !Number.isFinite(percent) ||
    percent <= 0
  ) {
    return null
  }

  const insideMin = chartType === 'donut' ? 0.14 : 0.08
  const inside = percent >= insideMin
  const angle = -midAngle * RADIAN
  const radius = inside
    ? innerRadius + (outerRadius - innerRadius) * (innerRadius > 0 ? 0.5 : 0.62)
    : outerRadius + 16
  const x = cx + radius * Math.cos(angle)
  const y = cy + radius * Math.sin(angle)
  const anchor = inside ? 'middle' : x >= cx ? 'start' : 'end'
  const lineEndRadius = outerRadius + 12

  return (
    <g className={inside ? 'pie-slice-label' : 'pie-slice-label pie-slice-label--outside'}>
      {inside ? null : (
        <path
          className="pie-slice-label__line"
          d={`M${cx + (outerRadius + 2) * Math.cos(angle)},${cy + (outerRadius + 2) * Math.sin(angle)}L${cx + lineEndRadius * Math.cos(angle)},${cy + lineEndRadius * Math.sin(angle)}`}
          fill="none"
        />
      )}
      <text x={x} y={y} textAnchor={anchor} dominantBaseline="central">
        {formatSharePercent(percent)}
      </text>
    </g>
  )
}

const tooltipStyle = {
  borderRadius: 12,
  border: '2px solid #d8c8b0',
  background: '#fff8ec',
  boxShadow: '0 5px 0 rgba(90, 70, 40, 0.1)',
}

function useChartSize(chartType, itemCount) {
  const ref = useRef(null)
  const [size, setSize] = useState({ width: 320, height: 280, isCompact: true })

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined

    const update = () => {
      const next = getCategoryChartLayout(element.clientWidth, chartType, itemCount)

      setSize((current) =>
        current.width === next.width &&
        current.height === next.height &&
        current.isCompact === next.isCompact
          ? current
          : next,
      )
    }

    update()

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update)
      return () => window.removeEventListener('resize', update)
    }

    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [chartType, itemCount])

  return { ref, size }
}

function ChartTooltip({ active, payload, total }) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  const value = Number(item.value || 0)
  const share = total > 0 ? formatSharePercent(value / total) : '0%'
  return (
    <div className="chart-tooltip">
      <strong>{item.name || item.payload?.name}</strong>
      <span>
        {share} · ¥{formatMoney(value)}
      </span>
    </div>
  )
}

export default function CategoryChart({ chartType, data, onSliceClick }) {
  const { ref, size } = useChartSize(chartType, data.length)

  if (!data.length) return null

  const total = data.reduce((sum, entry) => sum + (Number(entry.value) || 0), 0)
  const pieRadii = chartType === 'bar' ? null : getPieRadii(size, chartType)

  const getCellProps = (entry) => {
    const share = total > 0 ? formatSharePercent(entry.value / total) : '0%'
    const interactive = Boolean(onSliceClick && (entry.hasChildren || entry.drillable))
    if (!interactive) {
      return {
        className: 'category-chart__slice',
        'aria-label': `${entry.name} ${share}`,
      }
    }

    return {
      className: 'category-chart__slice category-chart__slice--interactive',
      role: 'button',
      tabIndex: 0,
      'aria-label': `查看${entry.name}的明细，占${share}`,
      onClick: () => onSliceClick(entry),
      onKeyDown: (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return
        event.preventDefault()
        onSliceClick(entry)
      },
    }
  }

  return (
    <div className="pie-chart-wrap" ref={ref}>
      {chartType === 'bar' ? (
        <BarChart
          width={size.width}
          height={size.height}
          data={data}
          accessibilityLayer={false}
          layout={size.isCompact ? 'vertical' : 'horizontal'}
          margin={
            size.isCompact
              ? { top: 8, right: 12, left: 0, bottom: 4 }
              : { top: 8, right: 8, left: 0, bottom: 8 }
          }
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(120,100,80,0.2)"
            horizontal={!size.isCompact}
            vertical={size.isCompact}
          />
          {size.isCompact ? (
            <>
              <XAxis
                type="number"
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => (value / 100).toFixed(0)}
                height={28}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11 }}
                width={72}
                interval={0}
                axisLine={false}
                tickLine={false}
              />
            </>
          ) : (
            <>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11 }}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={56}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => (value / 100).toFixed(0)}
                width={42}
              />
            </>
          )}
          <Tooltip content={<ChartTooltip total={total} />} contentStyle={tooltipStyle} />
          <Bar
            dataKey="value"
            radius={size.isCompact ? [0, 10, 10, 0] : [10, 10, 0, 0]}
            barSize={size.isCompact ? 22 : undefined}
            isAnimationActive
            animationDuration={300}
            animationBegin={0}
          >
            {data.map((entry) => (
              <Cell key={entry.categoryId} fill={entry.fill} {...getCellProps(entry)} />
            ))}
          </Bar>
        </BarChart>
      ) : (
        <PieChart width={size.width} height={size.height} accessibilityLayer={false}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={pieRadii.inner}
            outerRadius={pieRadii.outer}
            paddingAngle={2}
            label={(props) => <ShareLabel {...props} chartType={chartType} />}
            labelLine={false}
            isAnimationActive
            animationDuration={400}
            animationBegin={0}
          >
            {data.map((entry) => (
              <Cell key={entry.categoryId} fill={entry.fill} {...getCellProps(entry)} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip total={total} />} contentStyle={tooltipStyle} />
        </PieChart>
      )}
    </div>
  )
}
