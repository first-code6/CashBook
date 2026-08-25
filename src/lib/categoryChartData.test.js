import { describe, expect, it } from 'vitest'
import {
  buildCategoryChartGroup,
  getBranchTransactions,
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

describe('getBranchTransactions', () => {
  it('returns transactions whose category rolls up to the given branch', () => {
    const transactions = [
      { ...transaction('fuel', 1200), id: 't1', createdAt: '2024-01-02T10:00:00' },
      { ...transaction('toll', 800), id: 't2', createdAt: '2024-01-02T11:00:00' },
      { ...transaction('vehicle', 300), id: 't3', createdAt: '2024-01-02T09:00:00' },
      { ...transaction('food', 500), id: 't4', createdAt: '2024-01-02T08:00:00' },
      { ...transaction('salary', 9000, 'income'), id: 't5', createdAt: '2024-01-02T12:00:00' },
    ]

    const fuelTx = getBranchTransactions(transactions, categories, 'expense', 'vehicle', 'fuel')
    expect(fuelTx.map((t) => t.id)).toEqual(['t1'])

    const ownTx = getBranchTransactions(
      transactions,
      categories,
      'expense',
      'vehicle',
      'vehicle',
    )
    expect(ownTx.map((t) => t.id)).toEqual(['t3'])

    const uncategorizedTx = getBranchTransactions(
      transactions,
      categories,
      'expense',
      UNCATEGORIZED_CATEGORY_ID,
      UNCATEGORIZED_CATEGORY_ID,
    )
    expect(uncategorizedTx).toEqual([])

    const sorted = getBranchTransactions(
      [
        { ...transaction('fuel', 100), id: 'a', createdAt: '2024-01-01T08:00:00' },
        { ...transaction('fuel', 200), id: 'b', createdAt: '2024-01-03T08:00:00' },
      ],
      categories,
      'expense',
      'vehicle',
      'fuel',
    )
    expect(sorted.map((t) => t.id)).toEqual(['b', 'a'])
  })
})
