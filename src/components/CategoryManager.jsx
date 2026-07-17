import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button, Input, Modal } from 'animal-island-ui'
import CategoryIcon, { CATEGORY_ICON_OPTIONS } from './CategoryIcon'
import { useCashbook } from '../context/CashbookContext'
import { useAlertDialog } from '../hooks/useAlertDialog'
import { buildCategoryTree } from '../lib/categories'

function IconPickerButton({ value, onChange, size = 40 }) {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef(null)
  const panelRef = useRef(null)
  const [coords, setCoords] = useState({ top: 0, left: 0 })

  const placePanel = () => {
    const rect = buttonRef.current?.getBoundingClientRect()
    if (!rect) return

    const panelWidth = 280
    const panelHeight = 260
    const gap = 8
    const left = Math.min(
      Math.max(12, rect.left + rect.width / 2 - panelWidth / 2),
      window.innerWidth - panelWidth - 12,
    )
    const below = rect.bottom + gap
    const top =
      below + panelHeight > window.innerHeight - 12
        ? Math.max(12, rect.top - gap - panelHeight)
        : below

    setCoords({ top, left })
  }

  const handleOpen = (event) => {
    event.preventDefault()
    event.stopPropagation()
    placePanel()
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return undefined

    const handlePointer = (event) => {
      const target = event.target
      if (buttonRef.current?.contains(target)) return
      if (panelRef.current?.contains(target)) return
      setOpen(false)
    }

    const handleKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    const handleReposition = () => placePanel()

    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('touchstart', handlePointer)
    document.addEventListener('keydown', handleKey)
    window.addEventListener('resize', handleReposition)
    window.addEventListener('scroll', handleReposition, true)

    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('touchstart', handlePointer)
      document.removeEventListener('keydown', handleKey)
      window.removeEventListener('resize', handleReposition)
      window.removeEventListener('scroll', handleReposition, true)
    }
  }, [open])

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={`icon-picker-btn${open ? ' icon-picker-btn--open' : ''}`}
        style={{ width: size, height: size }}
        aria-label="选择图标"
        aria-expanded={open}
        onClick={handleOpen}
      >
        <CategoryIcon name={value || 'other'} size={Math.round(size * 0.72)} />
      </button>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            className="icon-picker-popover"
            style={{ top: coords.top, left: coords.left }}
            role="listbox"
            aria-label="图标列表"
            onMouseDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
          >
            <p className="icon-picker-popover__title">选择图标</p>
            <div className="icon-picker-grid">
              {CATEGORY_ICON_OPTIONS.map((key) => {
                const active = key === value
                return (
                  <button
                    key={key}
                    type="button"
                    role="option"
                    aria-selected={active}
                    className={`icon-picker-grid__item${active ? ' icon-picker-grid__item--active' : ''}`}
                    onClick={() => {
                      onChange(key)
                      setOpen(false)
                    }}
                  >
                    <CategoryIcon name={key} size={30} />
                  </button>
                )
              })}
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}

function CategoryEditorModal({
  open,
  type,
  title,
  categories,
  onClose,
  onAdd,
  onUpdate,
  onDelete,
  showAlert,
}) {
  const tree = useMemo(() => buildCategoryTree(categories, type), [categories, type])
  const [draft, setDraft] = useState(null)
  const [editingId, setEditingId] = useState('')
  const [editName, setEditName] = useState('')
  const [editIcon, setEditIcon] = useState('other')
  const [expandedIds, setExpandedIds] = useState(() => new Set())

  const resetUi = () => {
    setDraft(null)
    setEditingId('')
    setEditName('')
    setEditIcon('other')
    setExpandedIds(new Set())
  }

  const handleClose = () => {
    resetUi()
    onClose()
  }

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const startAddRoot = () => {
    setEditingId('')
    setDraft({
      parentId: null,
      name: '',
      icon: type === 'income' ? 'salary' : 'food',
      label: '添加一级分类',
    })
  }

  const startAddChild = (parent) => {
    setEditingId('')
    setExpandedIds((prev) => new Set(prev).add(parent.id))
    setDraft({
      parentId: parent.id,
      name: '',
      icon: parent.icon || 'other',
      label: `添加到「${parent.name}」`,
    })
  }

  const handleConfirmAdd = () => {
    if (!draft) return
    const result = onAdd({
      name: draft.name,
      type,
      parentId: draft.parentId,
      icon: draft.icon || 'other',
    })
    if (!result.ok) {
      showAlert(result.message, { title: '无法添加' })
      return
    }
    const label = draft.name.trim()
    setDraft(null)
    showAlert(draft.parentId ? `已添加子分类「${label}」` : `已添加一级分类「${label}」`, {
      title: '设置成功',
      confirmText: '好的',
    })
  }

  const startEdit = (item) => {
    setDraft(null)
    setEditingId(item.id)
    setEditName(item.name)
    setEditIcon(item.icon || 'other')
  }

  const handleSaveEdit = () => {
    const result = onUpdate(editingId, { name: editName, icon: editIcon })
    if (!result.ok) {
      showAlert(result.message, { title: '无法保存' })
      return
    }
    setEditingId('')
    showAlert('分类已更新', { title: '设置成功', confirmText: '好的' })
  }

  const handleDelete = (item) => {
    const result = onDelete(item.id)
    if (!result.ok) {
      showAlert(result.message, { title: '无法删除' })
      return
    }
    if (editingId === item.id) setEditingId('')
    showAlert(`已删除分类「${item.name}」`, {
      title: '设置成功',
      confirmText: '好的',
    })
  }

  return (
    <Modal
      open={open}
      title={title}
      typewriter={false}
      onClose={handleClose}
      footer={null}
    >
      <div className="category-editor">
        <div className="category-editor__head">
          <div className="category-toolbar">
            <Button type="primary" size="small" onClick={startAddRoot}>
              ＋ 一级分类
            </Button>
          </div>

          {draft && (
            <div className="category-draft">
              <p className="category-draft__label">{draft.label}</p>
              <div className="category-draft__row">
                <IconPickerButton
                  value={draft.icon}
                  onChange={(icon) => setDraft((prev) => (prev ? { ...prev, icon } : prev))}
                />
                <Input
                  placeholder="分类名称"
                  value={draft.name}
                  onChange={(event) =>
                    setDraft((prev) => (prev ? { ...prev, name: event.target.value } : prev))
                  }
                />
                <Button size="small" onClick={() => setDraft(null)}>
                  取消
                </Button>
                <Button type="primary" size="small" onClick={handleConfirmAdd}>
                  添加
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="category-editor__list">
          {tree.length === 0 ? (
            <p className="empty-text">还没有分类，点上方按钮添加一个吧</p>
          ) : (
            <div className="category-tree">
              {tree.map((root) => {
                const isEditingRoot = editingId === root.id
                const isExpanded = expandedIds.has(root.id)
                const canExpand = root.children.length > 0

                return (
                  <div key={root.id} className="category-tree__group">
                    <div
                      className={`category-row category-row--root${isEditingRoot ? ' category-row--editing' : ''}`}
                    >
                      {isEditingRoot ? (
                        <div className="category-edit">
                          <div className="category-edit__row">
                            <IconPickerButton value={editIcon} onChange={setEditIcon} />
                            <Input
                              value={editName}
                              onChange={(event) => setEditName(event.target.value)}
                              placeholder="分类名称"
                            />
                          </div>
                          <div className="category-edit__actions">
                            <Button size="small" onClick={() => setEditingId('')}>
                              取消
                            </Button>
                            <Button size="small" type="primary" onClick={handleSaveEdit}>
                              保存
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <button
                            type="button"
                            className={`category-row__main category-row__toggle${canExpand ? '' : ' category-row__toggle--leaf'}`}
                            aria-expanded={canExpand ? isExpanded : undefined}
                            onClick={() => {
                              if (canExpand) toggleExpand(root.id)
                            }}
                          >
                            <span
                              className={`category-row__chevron${isExpanded ? ' category-row__chevron--open' : ''}${canExpand ? '' : ' category-row__chevron--hidden'}`}
                              aria-hidden="true"
                            />
                            <CategoryIcon name={root.icon} size={28} />
                            <span className="category-row__name">{root.name}</span>
                          </button>
                          <div className="category-row__actions">
                            <Button size="small" onClick={() => startAddChild(root)}>
                              ＋
                            </Button>
                            <Button size="small" onClick={() => startEdit(root)}>
                              编辑
                            </Button>
                            <Button size="small" danger onClick={() => handleDelete(root)}>
                              删除
                            </Button>
                          </div>
                        </>
                      )}
                    </div>

                    {isExpanded && canExpand ? (
                      <div className="category-tree__children">
                        {root.children.map((child) => {
                          const isEditingChild = editingId === child.id
                          return (
                            <div
                              key={child.id}
                              className={`category-row category-row--child${isEditingChild ? ' category-row--editing' : ''}`}
                            >
                              {isEditingChild ? (
                                <div className="category-edit">
                                  <div className="category-edit__row">
                                    <IconPickerButton
                                      value={editIcon}
                                      onChange={setEditIcon}
                                      size={36}
                                    />
                                    <Input
                                      value={editName}
                                      onChange={(event) => setEditName(event.target.value)}
                                      placeholder="子分类名称"
                                    />
                                  </div>
                                  <div className="category-edit__actions">
                                    <Button size="small" onClick={() => setEditingId('')}>
                                      取消
                                    </Button>
                                    <Button size="small" type="primary" onClick={handleSaveEdit}>
                                      保存
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="category-row__main">
                                    <span className="category-row__branch" aria-hidden="true" />
                                    <CategoryIcon name={child.icon} size={24} />
                                    <span className="category-row__name">{child.name}</span>
                                  </div>
                                  <div className="category-row__actions">
                                    <Button size="small" onClick={() => startEdit(child)}>
                                      编辑
                                    </Button>
                                    <Button
                                      size="small"
                                      danger
                                      onClick={() => handleDelete(child)}
                                    >
                                      删除
                                    </Button>
                                  </div>
                                </>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="category-editor__foot">
          <Button type="primary" block onClick={handleClose}>
            完成
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default function CategoryManager() {
  const { state, addCategory, updateCategory, deleteCategory } = useCashbook()
  const { showAlert, alertDialog } = useAlertDialog()
  const [editorType, setEditorType] = useState('')

  return (
    <div className="category-manager">
      <div className="category-entry">
        <button
          type="button"
          className="category-entry__btn category-entry__btn--expense"
          onClick={() => setEditorType('expense')}
        >
          <CategoryIcon name="shopping" size={36} />
          <span className="category-entry__copy">
            <strong>支出分类</strong>
            <span>点按管理</span>
          </span>
          <span className="category-entry__chevron" aria-hidden="true">
            ›
          </span>
        </button>

        <button
          type="button"
          className="category-entry__btn category-entry__btn--income"
          onClick={() => setEditorType('income')}
        >
          <CategoryIcon name="salary" size={36} />
          <span className="category-entry__copy">
            <strong>收入分类</strong>
            <span>点按管理</span>
          </span>
          <span className="category-entry__chevron" aria-hidden="true">
            ›
          </span>
        </button>
      </div>

      <CategoryEditorModal
        open={editorType === 'expense'}
        type="expense"
        title="支出分类"
        categories={state.categories}
        onClose={() => setEditorType('')}
        onAdd={addCategory}
        onUpdate={updateCategory}
        onDelete={deleteCategory}
        showAlert={showAlert}
      />

      <CategoryEditorModal
        open={editorType === 'income'}
        type="income"
        title="收入分类"
        categories={state.categories}
        onClose={() => setEditorType('')}
        onAdd={addCategory}
        onUpdate={updateCategory}
        onDelete={deleteCategory}
        showAlert={showAlert}
      />

      {alertDialog}
    </div>
  )
}
