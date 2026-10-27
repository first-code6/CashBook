/** Display a 0–1 ratio as a share, keeping one decimal when it is not a whole number. */
export function formatSharePercent(ratio) {
  const percent = Number(ratio) * 100
  if (!Number.isFinite(percent) || percent <= 0) return '0%'
  if (percent >= 99.95) return '100%'
  if (percent < 0.05) return '<0.1%'

  const rounded = Math.round(percent * 10) / 10
  if (Number.isInteger(rounded)) return `${rounded}%`
  return `${rounded.toFixed(1)}%`
}

export function getCategoryChartLayout(width, chartType, itemCount) {
  const normalizedWidth = Math.max(Math.floor(Number(width) || 320), 1)
  const isCompact = normalizedWidth < 560
  const height =
    chartType === 'bar' && isCompact
      ? Math.max(240, itemCount * 42 + 54)
      : Math.min(
          Math.max(Math.round(normalizedWidth * (isCompact ? 0.86 : 0.66)), 230),
          360,
        )

  return {
    width: normalizedWidth,
    height,
    isCompact,
  }
}
