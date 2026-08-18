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
import { getCategoryChartLayout } from '../lib/chartLayout'
import { formatMoney } from '../lib/money'

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

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="chart-tooltip">
      <strong>{item.name || item.payload?.name}</strong>
      <span>¥{formatMoney(Number(item.value || 0))}</span>
    </div>
  )
}

export default function CategoryChart({ chartType, data, onSliceClick }) {
  const { ref, size } = useChartSize(chartType, data.length)

  if (!data.length) return null

  const getCellProps = (entry) => {
    const interactive = Boolean(onSliceClick && entry.hasChildren)
    if (!interactive) return { className: 'category-chart__slice' }

    return {
      className: 'category-chart__slice category-chart__slice--interactive',
      role: 'button',
      tabIndex: 0,
      'aria-label': `查看${entry.name}的子分类统计`,
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
          <Tooltip content={<ChartTooltip />} contentStyle={tooltipStyle} />
          <Bar
            dataKey="value"
            radius={size.isCompact ? [0, 10, 10, 0] : [10, 10, 0, 0]}
            barSize={size.isCompact ? 22 : undefined}
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
            innerRadius={
              chartType === 'donut' ? Math.min(size.width, size.height) * 0.24 : 0
            }
            outerRadius={
              Math.min(size.width, size.height) * (size.isCompact ? 0.39 : 0.36)
            }
            paddingAngle={2}
          >
            {data.map((entry) => (
              <Cell key={entry.categoryId} fill={entry.fill} {...getCellProps(entry)} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} contentStyle={tooltipStyle} />
        </PieChart>
      )}
    </div>
  )
}
