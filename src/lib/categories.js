import { inferCategoryIcon } from '../data/defaultCategories'

/**
 * Normalize a raw category record from storage / import.
 * Legacy flat categories become top-level with inferred icons.
 */
export function normalizeCategory(item) {
  if (
    !item ||
    typeof item.id !== 'string' ||
    typeof item.name !== 'string' ||
    (item.type !== 'income' && item.type !== 'expense')
  ) {
    return null
  }

  const parentId =
    typeof item.parentId === 'string' && item.parentId.trim() ? item.parentId : null

  const icon =
    typeof item.icon === 'string' && item.icon.trim()
      ? item.icon.trim()
      : inferCategoryIcon(item.id, item.name)

  return {
    id: item.id,
    name: item.name.trim() || item.name,
    type: item.type,
    parentId,
    icon,
  }
}

/** Drop orphan parent links (parent missing or wrong type / nested too deep). */
export function repairCategoryTree(categories) {
  const byId = Object.fromEntries(categories.map((item) => [item.id, item]))

  return categories.map((item) => {
    if (!item.parentId) return item

    const parent = byId[item.parentId]
    if (!parent || parent.type !== item.type || parent.parentId) {
      return { ...item, parentId: null }
    }

    return item
  })
}

export function getCategoryMap(categories) {
  return Object.fromEntries(categories.map((item) => [item.id, item]))
}

/** Display label: `车辆 · 加油` or `交通`. */
export function getCategoryPathLabel(categories, categoryId) {
  const map = getCategoryMap(categories)
  const category = map[categoryId]
  if (!category) return '未分类'

  if (category.parentId && map[category.parentId]) {
    return `${map[category.parentId].name} · ${category.name}`
  }

  return category.name
}

export function getCategoryIconName(categories, categoryId) {
  const map = getCategoryMap(categories)
  const category = map[categoryId]
  if (!category) return 'other'
  if (category.icon) return category.icon
  if (category.parentId && map[category.parentId]?.icon) {
    return map[category.parentId].icon
  }
  return inferCategoryIcon(category.id, category.name)
}

/**
 * Options for transaction Select, parents first then children.
 * Children use path labels.
 */
export function getCategorySelectOptions(categories, type) {
  const ofType = categories.filter((item) => item.type === type)
  const roots = ofType.filter((item) => !item.parentId)
  const options = []

  for (const root of roots) {
    options.push({
      value: root.id,
      label: root.name,
      icon: root.icon,
      depth: 0,
    })

    const children = ofType.filter((item) => item.parentId === root.id)
    for (const child of children) {
      options.push({
        value: child.id,
        label: `${root.name} · ${child.name}`,
        icon: child.icon || root.icon,
        depth: 1,
      })
    }
  }

  return options
}

/** Group categories into a tree for the manager UI. */
export function buildCategoryTree(categories, type) {
  const ofType = categories.filter((item) => item.type === type)
  const roots = ofType.filter((item) => !item.parentId)

  return roots.map((root) => ({
    ...root,
    children: ofType.filter((item) => item.parentId === root.id),
  }))
}
