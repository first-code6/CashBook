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
