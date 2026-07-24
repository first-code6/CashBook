import { useEffect, useMemo, useState } from 'react'
import { Button, Input } from 'animal-island-ui'
import CategoryIcon, { CATEGORY_ICON_OPTIONS } from './CategoryIcon'
import CategoryTileGrid from './CategoryTileGrid'
import FullScreenPage from './FullScreenPage'
import { buildCategoryTree, getCategoryMap } from '../lib/categories'

/**
 * 分类浏览 / 选择 / 管理 共用全屏面板。
 * mode: 'pick' | 'manage'
 */
export default function CategoryBrowseScreen({
  open,
  type,
  title,
  categories,
  mode = 'pick',
  onClose,
  onPick,
  onAdd,
  onUpdate,
  onDelete,
  showAlert,
}) {
  const tree = useMemo(() => buildCategoryTree(categories, type), [categories, type])
  const map = useMemo(() => getCategoryMap(categories), [categories])
  const [expandedId, setExpandedId] = useState(null)
  const [screen, setScreen] = useState('browse') // browse | add | edit
  const [draftName, setDraftName] = useState('')
  const [draftIcon, setDraftIcon] = useState(type === 'income' ? 'salary' : 'food')
  const [editing, setEditing] = useState(null)
  const [addParentId, setAddParentId] = useState(null)

  useEffect(() => {
    if (!open) return
    setExpandedId(null)
    setScreen('browse')
    setDraftName('')
    setDraftIcon(type === 'income' ? 'salary' : 'food')
    setEditing(null)
    setAddParentId(null)
  }, [open, type])

  const reset = () => {
    setExpandedId(null)
    setScreen('browse')
    setDraftName('')
    setDraftIcon(type === 'income' ? 'salary' : 'food')
    setEditing(null)
    setAddParentId(null)
  }

  const handleClose = () => {
    reset()
    onClose?.()
  }

  const items = useMemo(
    () =>
      tree.map((root) => ({
        id: root.id,
        name: root.name,
        icon: root.icon,
        children: root.children.map((child) => ({
          id: child.id,
          name: child.name,
          icon: child.icon,
        })),
      })),
    [tree],
  )

  const expandedParent = expandedId ? map[expandedId] : null
  const addParent = addParentId ? map[addParentId] : null

  const pageTitle =
    screen === 'add'
      ? addParent
        ? `添加 · ${addParent.name}`
        : `添加${title}`
      : screen === 'edit'
        ? '编辑分类'
        : title

  const goBack = () => {
    if (screen === 'add' || screen === 'edit') {
      setScreen('browse')
      setEditing(null)
      setDraftName('')
      setAddParentId(null)
      return
    }
    handleClose()
  }

  const openAdd = (parentId = null) => {
    const parent = parentId ? map[parentId] : null
    setAddParentId(parentId)
    setDraftName('')
    setDraftIcon(parent?.icon || (type === 'income' ? 'salary' : 'food'))
    setScreen('add')
  }

  const handleTile = (item) => {
    if (mode === 'pick') {
      onPick?.(item.id)
      handleClose()
      return
    }

    setEditing(item)
    setDraftName(item.name)
    setDraftIcon(item.icon || 'other')
    setScreen('edit')
  }

  const handleConfirmAdd = () => {
    const result = onAdd?.({
      name: draftName,
      type,
      parentId: addParentId,
      icon: draftIcon,
    })
    if (!result?.ok) {
      showAlert?.(result?.message || '无法添加', { title: '无法添加' })
      return
    }
    setScreen('browse')
    setDraftName('')
    setAddParentId(null)
    showAlert?.(
      addParentId ? `已添加子分类「${draftName.trim()}」` : `已添加分类「${draftName.trim()}」`,
      { title: '设置成功', confirmText: '好的' },
    )
  }

  const handleConfirmEdit = () => {
    if (!editing) return
    const result = onUpdate?.(editing.id, { name: draftName, icon: draftIcon })
    if (!result?.ok) {
      showAlert?.(result?.message || '无法保存', { title: '无法保存' })
      return
    }
    setScreen('browse')
    setEditing(null)
    showAlert?.('分类已更新', { title: '设置成功', confirmText: '好的' })
  }

  const handleDelete = () => {
    if (!editing) return
    const result = onDelete?.(editing.id)
    if (!result?.ok) {
      showAlert?.(result?.message || '无法删除', { title: '无法删除' })
      return
    }
    if (expandedId === editing.id) setExpandedId(null)
    setScreen('browse')
    setEditing(null)
    showAlert?.(`已删除分类「${editing.name}」`, {
      title: '设置成功',
      confirmText: '好的',
    })
  }

  const renderForm = (confirmLabel, onConfirm, showDelete = false) => (
    <div className="cat-form">
      <p className="cat-form__label">选择图标</p>
      <div className="cat-form__icons">
        {CATEGORY_ICON_OPTIONS.map((key) => {
          const active = key === draftIcon
          return (
            <button
              key={key}
              type="button"
              className={`cat-form__icon-btn${active ? ' cat-form__icon-btn--active' : ''}`}
              onClick={() => setDraftIcon(key)}
            >
              <CategoryIcon name={key} size={34} />
            </button>
          )
        })}
      </div>
      <p className="cat-form__label">名称</p>
      <Input
        placeholder="分类名称"
        value={draftName}
        onChange={(event) => setDraftName(event.target.value)}
      />
      <div className="cat-form__actions">
        {showDelete ? (
          <Button danger block onClick={handleDelete}>
            删除
          </Button>
        ) : null}
        <Button type="primary" block onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </div>
  )

  return (
    <FullScreenPage
      open={open}
      title={pageTitle}
      onClose={goBack}
      headerRight={
        mode === 'manage' && screen === 'browse' ? (
          <div className="fs-page__header-actions">
            {expandedParent ? (
              <>
                <button
                  type="button"
                  className="fs-page__action fs-page__action--text"
                  onClick={() => {
                    setEditing(expandedParent)
                    setDraftName(expandedParent.name)
                    setDraftIcon(expandedParent.icon || 'other')
                    setScreen('edit')
                  }}
                >
                  编辑
                </button>
                <button
                  type="button"
                  className="fs-page__action fs-page__action--text"
                  onClick={() => openAdd(expandedId)}
                >
                  子类
                </button>
              </>
            ) : null}
            <button type="button" className="fs-page__action" onClick={() => openAdd(null)}>
              ＋
            </button>
          </div>
        ) : null
      }
    >
      {screen === 'browse' ? (
        items.length === 0 && mode === 'manage' ? (
          <div className="cat-browse-empty">
            <p className="empty-text">还没有分类</p>
            <Button type="primary" onClick={() => openAdd(null)}>
              添加分类
            </Button>
          </div>
        ) : items.length === 0 ? (
          <p className="empty-text">暂无分类</p>
        ) : (
          <CategoryTileGrid
            items={items}
            selectedId={mode === 'pick' ? undefined : editing?.id}
            expandedId={expandedId}
            onExpand={setExpandedId}
            onSelect={handleTile}
            iconSize={28}
            trailing={
              mode === 'manage' ? (
                <button
                  type="button"
                  className="cat-grid__tile cat-grid__tile--add"
                  onClick={() => openAdd(null)}
                >
                  <span className="cat-grid__icon cat-grid__icon--add">＋</span>
                  <span className="cat-grid__label">添加</span>
                </button>
              ) : null
            }
          />
        )
      ) : null}

      {screen === 'add' ? renderForm('添加', handleConfirmAdd, false) : null}
      {screen === 'edit' ? renderForm('保存', handleConfirmEdit, true) : null}
    </FullScreenPage>
  )
}
