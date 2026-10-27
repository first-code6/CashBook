import { describe, expect, it } from 'vitest'
import { formatSharePercent, getCategoryChartLayout } from './chartLayout'

describe('formatSharePercent', () => {
  it('shows a whole number without a trailing decimal', () => {
    expect(formatSharePercent(0.5)).toBe('50%')
    expect(formatSharePercent(1)).toBe('100%')
    expect(formatSharePercent(0)).toBe('0%')
  })

  it('keeps one decimal when the share is not a whole number', () => {
    expect(formatSharePercent(0.125)).toBe('12.5%')
    expect(formatSharePercent(0.333)).toBe('33.3%')
    expect(formatSharePercent(0.036)).toBe('3.6%')
  })

  it('marks a positive share that would round to zero', () => {
    expect(formatSharePercent(0.0004)).toBe('<0.1%')
  })
})

describe('getCategoryChartLayout', () => {
  it('uses a compact pie layout without exceeding the mobile width', () => {
    expect(getCategoryChartLayout(360, 'pie', 8)).toEqual({
      width: 360,
      height: 310,
      isCompact: true,
    })
  })

  it('grows compact bar charts vertically for readable category labels', () => {
    expect(getCategoryChartLayout(360, 'bar', 8)).toEqual({
      width: 360,
      height: 390,
      isCompact: true,
    })
  })

  it('caps chart height on wider screens', () => {
    expect(getCategoryChartLayout(640, 'pie', 8)).toEqual({
      width: 640,
      height: 360,
      isCompact: false,
    })
  })
})
