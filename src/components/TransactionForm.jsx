import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Input, Modal } from 'animal-island-ui'
import CategoryTileGrid from './CategoryTileGrid'
import DatePicker from './DatePicker'
import FullScreenPage from './FullScreenPage'
import { useCashbook } from '../context/CashbookContext'
import { buildCategoryTree, getCategoryMap } from '../lib/categories'
import { getToday } from '../lib/date'
import { fenToYuan, yuanToFen } from '../lib/money'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫']

function AmountKeypad({ id, value, onChange, onDone }) {
  const pushKey = (key) => {
    if (key === '⌫') {
      onChange(String(value || '').slice(0, -1))
      return
    }
    if (key === '.') {
      if (String(value || '').includes('.')) return
      onChange(value ? `${value}.` : '0.')
      return
    }
    const next = `${value || ''}${key}`
    const [intPart, decPart] = next.split('.')
    if (decPart != null && decPart.length > 2) return
    if (intPart.length > 9) return
    if (!next.includes('.') && next.length > 1 && next.startsWith('0')) {
      onChange(key)
      return
    }
    onChange(next)
  }

  return (
    <div className="amount-keypad" id={id}>
      <div className="amount-keypad__grid">
        {KEYS.map((key) => (
          <button
            key={key}
            type="button"
            className={`amount-keypad__key${key === '⌫' ? ' amount-keypad__key--action' : ''}`}
            onClick={() => pushKey(key)}
            aria-label={key === '⌫' ? '删除一位' : undefined}
          >
            {key}
          </button>
        ))}
      </div>
      <Button type="primary" block onClick={onDone}>
        完成
      </Button>
    </div>
  )
}

export default function TransactionForm({
  open,
  onClose,
  onSuccess,
  defaultDate,
  transaction = null,
}) {
  const { state, addTransaction, updateTransaction } = useCashbook()
  const isEditing = Boolean(transaction?.id)
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(getToday)
  const [errorOpen, setErrorOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [keypadOpen, setKeypadOpen] = useState(false)
  const [expandedCategoryId, setExpandedCategoryId] = useState(null)
  const amountTriggerRef = useRef(null)
  const keypadRef = useRef(null)

  useEffect(() => {
    if (!open) return

    if (transaction) {
      const map = getCategoryMap(state.categories)
      const category = map[transaction.categoryId]
      setType(transaction.type || 'expense')
      setAmount(fenToYuan(transaction.amount || 0))
      setNote(transaction.note || '')
      setDate(transaction.date || defaultDate || getToday())
      setCategoryId(transaction.categoryId || '')
      setExpandedCategoryId(category?.parentId || null)
    } else {
      setType('expense')
      setAmount('')
      setNote('')
      setDate(defaultDate || getToday())
      setCategoryId('')
      setExpandedCategoryId(null)
    }
    setKeypadOpen(false)
  }, [open, defaultDate, transaction, state.categories])

  useEffect(() => {
    if (!open || !keypadOpen) return undefined

    const handleDocumentClick = (event) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (amountTriggerRef.current?.contains(target) || keypadRef.current?.contains(target)) {
        return
      }
      setKeypadOpen(false)
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setKeypadOpen(false)
    }

    document.addEventListener('click', handleDocumentClick)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('click', handleDocumentClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, keypadOpen])

  const categoryItems = useMemo(
    () =>
      buildCategoryTree(state.categories, type).map((root) => ({
        id: root.id,
        name: root.name,
        icon: root.icon,
        children: root.children.map((child) => ({
          id: child.id,
          name: child.name,
          icon: child.icon,
        })),
      })),
    [state.categories, type],
  )

  const showError = (message) => {
    setErrorMessage(message)
    setErrorOpen(true)
  }

  const toggleType = () => {
    setType((prev) => (prev === 'expense' ? 'income' : 'expense'))
    setCategoryId('')
    setExpandedCategoryId(null)
  }

  const handleCategorySelect = (item) => {
    setCategoryId(item.id)
  }

  const handleSubmit = () => {
    try {
      const fen = yuanToFen(amount)
      if (fen <= 0) {
        showError('请输入有效金额')
        return
      }

      if (!categoryId) {
        showError('请选择分类')
        return
      }

      const payload = {
        type,
        amount: fen,
        categoryId,
        note: note.trim(),
        date,
      }

      if (isEditing) {
        updateTransaction(transaction.id, payload)
      } else {
        addTransaction(payload)
      }

      onClose()
      onSuccess?.({ ...payload, edited: isEditing })
    } catch (error) {
      showError(error instanceof Error ? error.message : '保存失败')
    }
  }

  const handleClose = () => {
    setKeypadOpen(false)
    onClose()
  }

  const amountDisplay = amount || '0.00'
  const typeLabel = type === 'income' ? '收入' : '支出'

  return (
    <>
      <FullScreenPage
        open={open}
        title={isEditing ? '修改记录' : '记一笔'}
        onClose={handleClose}
        footer={
          <div className="tx-footer">
            <div
              className={`tx-footer__panel${keypadOpen ? ' tx-footer__panel--visible' : ''}`}
              aria-hidden={!keypadOpen}
              inert={!keypadOpen}
            >
              <div className="tx-footer__panel-inner" ref={keypadRef}>
                <AmountKeypad
                  id="amount-keypad"
                  value={amount}
                  onChange={setAmount}
                  onDone={() => setKeypadOpen(false)}
                />
              </div>
            </div>
            <div
              className={`tx-footer__panel${keypadOpen ? '' : ' tx-footer__panel--visible'}`}
              aria-hidden={keypadOpen}
              inert={keypadOpen}
            >
              <div className="tx-footer__panel-inner">
                <div className="fs-page__footer-actions">
                  <Button block onClick={handleClose}>
                    取消
                  </Button>
                  <Button type="primary" block onClick={handleSubmit}>
                    {isEditing ? '保存修改' : '保存'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        }
      >
        <div className="tx-form tx-form--split">
          <section className="tx-form__cats">
            <div className="tx-form__section-head">
              <span className="form-field__label">分类</span>
            </div>
            <div className="tx-form__cats-scroll">
              {categoryItems.length === 0 ? (
                <p className="empty-text">暂无分类</p>
              ) : (
                <CategoryTileGrid
                  items={categoryItems}
                  selectedId={categoryId}
                  expandedId={expandedCategoryId}
                  onExpand={setExpandedCategoryId}
                  onSelect={handleCategorySelect}
                  iconSize={34}
                />
              )}
            </div>
          </section>

          <section className="tx-form__rest">
            <div className="tx-form__section">
              <span className="form-field__label">金额</span>
              <div
                className={`tx-amount${type === 'income' ? ' tx-amount--income' : ' tx-amount--expense'}`}
              >
                <button
                  type="button"
                  className="tx-amount__type"
                  onClick={toggleType}
                  aria-label={`切换为${type === 'income' ? '支出' : '收入'}`}
                >
                  {typeLabel}
                </button>
                <button
                  type="button"
                  className={`tx-amount__value${keypadOpen ? ' tx-amount__value--open' : ''}`}
                  onClick={() => setKeypadOpen(true)}
                  ref={amountTriggerRef}
                  aria-expanded={keypadOpen}
                  aria-controls="amount-keypad"
                >
                  <span className="tx-amount__currency">¥</span>
                  <span
                    className={`tx-amount__number${amount ? '' : ' tx-amount__number--placeholder'}`}
                  >
                    {amountDisplay}
                  </span>
                </button>
              </div>
            </div>

            <div className="tx-form__section tx-form__meta">
              <div className="form-field">
                <span className="form-field__label">日期</span>
                <DatePicker value={date} onChange={setDate} floating />
              </div>
              <div className="form-field">
                <label className="form-field__label" htmlFor="note">
                  备注
                </label>
                <Input
                  id="note"
                  placeholder="可选"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                />
              </div>
            </div>
          </section>
        </div>
      </FullScreenPage>

      <Modal
        open={errorOpen}
        title="提示"
        typewriter={false}
        onClose={() => setErrorOpen(false)}
        onOk={() => setErrorOpen(false)}
        footer={
          <div className="form-actions">
            <Button type="primary" onClick={() => setErrorOpen(false)}>
              知道了
            </Button>
          </div>
        }
      >
        <p>{errorMessage}</p>
      </Modal>
    </>
  )
}
