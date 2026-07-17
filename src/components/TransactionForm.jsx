import { useEffect, useMemo, useState } from 'react'
import { Button, Input, Modal } from 'animal-island-ui'
import SegmentedControl from './SegmentedControl'
import Select from './Select'
import DatePicker from './DatePicker'
import { useCashbook } from '../context/CashbookContext'
import { getToday } from '../lib/date'
import { yuanToFen } from '../lib/money'

export default function TransactionForm({ open, onClose, onSuccess, defaultDate }) {
  const { state, addTransaction } = useCashbook()
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(getToday)
  const [errorOpen, setErrorOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const categoryOptions = useMemo(
    () =>
      state.categories
        .filter((item) => item.type === type)
        .map((item) => ({ value: item.id, label: item.name })),
    [state.categories, type],
  )

  useEffect(() => {
    if (!open) return

    setType('expense')
    setAmount('')
    setNote('')
    setDate(defaultDate || getToday())
    setCategoryId('')
  }, [open, defaultDate])

  useEffect(() => {
    if (!categoryOptions.some((item) => item.value === categoryId)) {
      setCategoryId(categoryOptions[0]?.value || '')
    }
  }, [categoryOptions, categoryId])

  const showError = (message) => {
    setErrorMessage(message)
    setErrorOpen(true)
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

      addTransaction({
        type,
        amount: fen,
        categoryId,
        note: note.trim(),
        date,
      })

      onClose()
      onSuccess?.({ type, amount: fen, date })
    } catch (error) {
      showError(error instanceof Error ? error.message : '保存失败')
    }
  }

  return (
    <>
      <Modal
        open={open}
        title="记一笔"
        onClose={onClose}
        typewriter={false}
        footer={
          <div className="form-actions">
            <Button onClick={onClose}>取消</Button>
            <Button type="primary" onClick={handleSubmit}>
              保存
            </Button>
          </div>
        }
      >
        <div className="form-stack">
          <div className="form-field">
            <span className="form-field__label">类型</span>
            <SegmentedControl
              ariaLabel="记账类型"
              value={type}
              onChange={setType}
              options={[
                { label: '支出', value: 'expense' },
                { label: '收入', value: 'income' },
              ]}
            />
          </div>

          <div className="form-field">
            <label className="form-field__label" htmlFor="amount">
              金额（元）
            </label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </div>

          <div className="form-field">
            <span className="form-field__label">分类</span>
            <Select
              ariaLabel="分类"
              value={categoryId}
              onChange={setCategoryId}
              options={categoryOptions}
              placeholder="暂无分类"
            />
          </div>

          <div className="form-field">
            <span className="form-field__label">日期</span>
            <DatePicker value={date} onChange={setDate} />
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
      </Modal>

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
