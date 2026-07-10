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
import { formatMoney } from '../lib/money'

const tooltipStyle = {
  borderRadius: 12,
  border: '2px solid #d8c8b0',
  background: '#fff8ec',
}

function useChartSize() {
  const ref = useRef(null)
  const [size, setSize] = useState({ width: 320, height: 280 })

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined

    const update = () => {
      const width = Math.max(element.clientWidth || 320, 240)
      setSize({ width, height: Math.max(Math.round(width * 0.72), 240) })
    }

    update()

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update)
      return () => window.removeEventListener('resize', update)
    }

    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

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

export default function CategoryChart({ chartType, data }) {
  const { ref, size } = useChartSize()

  if (!data.length) return null

  return (
    <div className="pie-chart-wrap" ref={ref}>
      {chartType === 'bar' ? (
        <BarChart
          width={size.width}
          height={size.height}
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,100,80,0.2)" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={56} />
          <YAxis
            tick={{ fontSize: 11 }}
            tickFormatter={(value) => (value / 100).toFixed(0)}
            width={42}
          />
          <Tooltip content={<ChartTooltip />} contentStyle={tooltipStyle} />
          <Bar dataKey="value" radius={[10, 10, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.categoryId} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      ) : (
        <PieChart width={size.width} height={size.height}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={chartType === 'donut' ? Math.min(size.width, size.height) * 0.22 : 0}
            outerRadius={Math.min(size.width, size.height) * 0.36}
            paddingAngle={2}
          >
            {data.map((entry) => (
              <Cell key={entry.categoryId} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} contentStyle={tooltipStyle} />
        </PieChart>
      )}
    </div>
  )
}
