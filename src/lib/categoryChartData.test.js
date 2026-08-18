import { describe, expect, it } from 'vitest'
import {
  buildCategoryChartGroup,
  UNCATEGORIZED_CATEGORY_ID,
} from './categoryChartData'
import { getRootCategoryId } from './categories'

const categories = [
  {
    id: 'vehicle',
    name: '车子',
    type: 'expense',
    parentId: null,
    icon: 'vehicle',
  },
  {
    id: 'fuel',
    name: '加油',
    type: 'expense',
    parentId: 'vehicle',
    icon: 'fuel',
  },
  {
    id: 'toll',
    name: '路费',
    type: 'expense',
    parentId: 'vehicle',
    icon: 'vehicle',
  },
  {
    id: 'food',
    name: '餐饮',
    type: 'expense',
    parentId: null,
    icon: 'food',
  },
  {
    id: 'salary',
    name: '工资',
    type: 'income',
    parentId: null,
    icon: 'salary',
  },
]

function transaction(categoryId, amount, type = 'expense') {
  return { categoryId, amount, type }
}

describe('getRootCategoryId', () => {
  it('resolves children to their highest parent', () => {
    const nestedCategories = [
      ...categories,
      {
        id: 'fuel-card',
        name: '加油卡',
        type: 'expense',
        parentId: 'fuel',
        icon: 'fuel',
      },
    ]

    expect(getRootCategoryId(categories, 'fuel')).toBe('vehicle')
    expect(getRootCategoryId(nestedCategories, 'fuel-card')).toBe('vehicle')
    expect(getRootCategoryId(categories, 'vehicle')).toBe('vehicle')
    expect(getRootCategoryId(categories, 'missing')).toBeNull()
  })
})

describe('buildCategoryChartGroup', () => {
  it('rolls child values into one root slice and exposes child breakdowns', () => {
    const result = buildCategoryChartGroup(
      [
        transaction('fuel', 1200),
        transaction('toll', 800),
        transaction('food', 500),
        transaction('salary', 9000, 'income'),
      ],
      categories,
      'expense',
    )

    expect(result.total).toBe(2500)
    expect(result.slices).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          categoryId: 'vehicle',
          name: '车子',
          value: 2000,
          hasChildren: true,
        }),
        expect.objectContaining({
          categoryId: 'food',
          name: '餐饮',
          value: 500,
          hasChildren: false,
        }),
      ]),
    )
    expect(result.breakdowns.vehicle.slices).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ categoryId: 'fuel', name: '加油', value: 1200 }),
        expect.objectContaining({ categoryId: 'toll', name: '路费', value: 800 }),
      ]),
    )
  })

  it('keeps direct root transactions in a visible unclassified bucket', () => {
    const result = buildCategoryChartGroup(
      [transaction('vehicle', 300), transaction('fuel', 700)],
      categories,
      'expense',
    )

    expect(result.slices[0]).toEqual(
      expect.objectContaining({ categoryId: 'vehicle', value: 1000 }),
    )
    expect(result.breakdowns.vehicle).toEqual(
      expect.objectContaining({
        total: 1000,
        slices: expect.arrayContaining([
          expect.objectContaining({ categoryId: 'fuel', name: '加油', value: 700 }),
          expect.objectContaining({
            categoryId: 'vehicle',
            name: '本级（未细分）',
            value: 300,
          }),
        ]),
      }),
    )
  })

  it('keeps a leaf root non-drillable', () => {
    const result = buildCategoryChartGroup(
      [transaction('food', 450)],
      categories,
      'expense',
    )

    expect(result.slices).toEqual([
      expect.objectContaining({
        categoryId: 'food',
        value: 450,
        hasChildren: false,
      }),
    ])
  })

  it('combines unknown category ids into one uncategorized slice', () => {
    const result = buildCategoryChartGroup(
      [transaction('deleted-a', 100), transaction('deleted-b', 250)],
      categories,
      'expense',
    )

    expect(result.slices).toEqual([
      expect.objectContaining({
        categoryId: UNCATEGORIZED_CATEGORY_ID,
        name: '未分类',
        value: 350,
        hasChildren: false,
      }),
    ])
  })
})
