import CategoryIcon from './CategoryIcon'

const DEFAULT_COLS = 4

/**
 * 上 Icon、下文字的宫格；有子项时在所在行下方展开子菜单。
 * items: { id, name, icon, children?: same[] }
 */
export default function CategoryTileGrid({
  items,
  onSelect,
  selectedId,
  expandedId,
  onExpand,
  trailing,
  iconSize = 34,
  columns = DEFAULT_COLS,
  expandEmptyParents = false,
}) {
  const rows = []
  for (let i = 0; i < items.length; i += columns) {
    rows.push(items.slice(i, i + columns))
  }

  const handleClick = (item) => {
    const kids = item.children || []
    if (kids.length > 0 || expandEmptyParents) {
      onExpand?.(expandedId === item.id ? null : item.id)
      return
    }
    onExpand?.(null)
    onSelect?.(item)
  }

  const renderTile = (item, { child = false } = {}) => {
    const active = selectedId && String(selectedId) === String(item.id)
    const expanded = expandedId && String(expandedId) === String(item.id)
    const hasChildren = (item.children || []).length > 0
    const canExpand = !child && (hasChildren || expandEmptyParents)

    return (
      <button
        key={item.id}
        type="button"
        className={[
          'cat-grid__tile',
          child ? 'cat-grid__tile--child' : '',
          active ? 'cat-grid__tile--active' : '',
          expanded ? 'cat-grid__tile--expanded' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={() => (child ? onSelect?.(item) : handleClick(item))}
        aria-expanded={canExpand ? Boolean(expanded) : undefined}
      >
        <span className="cat-grid__icon">
          <CategoryIcon name={item.icon || 'other'} size={iconSize} />
        </span>
        <span className="cat-grid__label">{item.name}</span>
        {hasChildren && !child ? (
          <span
            className={`cat-grid__badge${expanded ? ' cat-grid__badge--open' : ''}`}
            aria-hidden="true"
          >
            ›
          </span>
        ) : null}
      </button>
    )
  }

  return (
    <div className="cat-grid-wrap">
      {rows.map((row, rowIndex) => {
        const expandedInRow = row.find(
          (item) => expandedId && String(item.id) === String(expandedId),
        )
        const children = expandedInRow?.children || []

        return (
          <div key={`row-${rowIndex}`} className="cat-grid-row">
            <div
              className="cat-grid"
              style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
            >
              {row.map((item) => renderTile(item))}
              {rowIndex === rows.length - 1 ? trailing : null}
            </div>

            {expandedInRow && children.length > 0 ? (
              <div className="cat-grid__submenu">
                <div
                  className="cat-grid cat-grid--children"
                  style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
                >
                  {children.map((child) => renderTile(child, { child: true }))}
                </div>
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
