import { describe, expect, it } from 'vitest'
import { getCategoryChartLayout } from './chartLayout'

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
