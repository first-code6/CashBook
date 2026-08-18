import { getCategoryMap, getRootCategory } from './categories'

export const UNCATEGORIZED_CATEGORY_ID = '__uncategorized__'

const PIE_COLORS = [
  '#F4A261',
  '#E76F51',
  '#2A9D8F',
  '#E9C46A',
  '#264653',
  '#8ECAE6',
  '#FB8500',
  '#90BE6D',
  '#F72585',
  '#4CC9F0',
  '#B5838D',
  '#6D6875',
]

function addAmount(totals, categoryId, amount) {
  totals.set(categoryId, (totals.get(categoryId) || 0) + amount)
}

function sortAndColor(slices) {
  return slices
    .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name, 'zh-CN'))
    .map((item, index) => ({
      ...item,
      fill: PIE_COLORS[index % PIE_COLORS.length],
    }))
}

function getRootBranch(categoryMap, category, rootId) {
  let branch = category
  const visited = new Set([branch.id])

  while (branch.parentId && branch.parentId !== rootId) {
    const parent = categoryMap[branch.parentId]
    if (!parent || parent.type !== branch.type || visited.has(parent.id)) break
    visited.add(parent.id)
    branch = parent
  }

  return branch
}

/**
 * Build the root roll-up and per-root drill-down used by the cycle charts.
 * Transactions are expected to be pre-filtered to the active billing cycle.
 */
export function buildCategoryChartGroup(transactions, categories, type) {
  const categoryMap = getCategoryMap(categories)
  const rootsWithDescendants = new Set()

  for (const category of categories) {
    if (category.type !== type) continue
    const root = getRootCategory(categoryMap, category.id)
    if (root && root.id !== category.id) rootsWithDescendants.add(root.id)
  }

  const rootTotals = new Map()
  const rootMeta = new Map()
  const breakdownTotals = new Map()
  const breakdownMeta = new Map()

  for (const transaction of transactions) {
    if (transaction.type !== type) continue

    const amount = Number(transaction.amount) || 0
    const category = categoryMap[transaction.categoryId]
    const root = getRootCategory(categoryMap, transaction.categoryId)
    const rootId = root?.id || UNCATEGORIZED_CATEGORY_ID

    addAmount(rootTotals, rootId, amount)
    rootMeta.set(rootId, {
      name: root?.name || '未分类',
      hasChildren: Boolean(root && rootsWithDescendants.has(root.id)),
    })

    if (!breakdownTotals.has(rootId)) {
      breakdownTotals.set(rootId, new Map())
      breakdownMeta.set(rootId, new Map())
    }

    const branch = category && root ? getRootBranch(categoryMap, category, root.id) : null
    const branchId = branch?.id || UNCATEGORIZED_CATEGORY_ID
    const isRootLevel = Boolean(root && branch?.id === root.id)

    addAmount(breakdownTotals.get(rootId), branchId, amount)
    breakdownMeta.get(rootId).set(branchId, {
      name: isRootLevel ? '本级（未细分）' : branch?.name || '未分类',
    })
  }

  const slices = sortAndColor(
    Array.from(rootTotals, ([categoryId, value]) => ({
      categoryId,
      name: rootMeta.get(categoryId)?.name || '未分类',
      value,
      hasChildren: rootMeta.get(categoryId)?.hasChildren || false,
    })),
  )

  const breakdowns = Object.fromEntries(
    Array.from(rootTotals.keys(), (rootId) => {
      const totals = breakdownTotals.get(rootId) || new Map()
      const metadata = breakdownMeta.get(rootId) || new Map()
      const breakdownSlices = sortAndColor(
        Array.from(totals, ([categoryId, value]) => ({
          categoryId,
          name: metadata.get(categoryId)?.name || '未分类',
          value,
          hasChildren: false,
        })),
      )

      return [
        rootId,
        {
          rootId,
          rootName: rootMeta.get(rootId)?.name || '未分类',
          slices: breakdownSlices,
          total: rootTotals.get(rootId) || 0,
        },
      ]
    }),
  )

  return {
    slices,
    breakdowns,
    total: slices.reduce((sum, item) => sum + item.value, 0),
  }
}
