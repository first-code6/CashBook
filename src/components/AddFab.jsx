import { useState } from 'react'
import { Button, Icon, Modal } from 'animal-island-ui'
import TransactionForm from './TransactionForm'
import { formatMoney } from '../lib/money'

export default function AddFab({ defaultDate }) {
  const [open, setOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [successInfo, setSuccessInfo] = useState(null)

  const handleSuccess = (info) => {
    setSuccessInfo(info)
    setSuccessOpen(true)
  }

  return (
    <>
      <button
        type="button"
        className="add-fab"
        aria-label="记一笔"
        onClick={() => setOpen(true)}
      >
        <Icon name="icon-shopping" size={34} bounce />
        <span className="add-fab__plus">+</span>
      </button>

      <TransactionForm
        open={open}
        defaultDate={defaultDate}
        onClose={() => setOpen(false)}
        onSuccess={handleSuccess}
      />

      <Modal
        open={successOpen}
        title="记账成功"
        typewriter={false}
        onClose={() => setSuccessOpen(false)}
        footer={
          <div className="form-actions">
            <Button type="primary" onClick={() => setSuccessOpen(false)}>
              太好了
            </Button>
          </div>
        }
      >
        <div className="success-dialog">
          <p className="success-dialog__emoji" aria-hidden="true">
            ★
          </p>
          <p>
            已记录一笔
            {successInfo?.type === 'income' ? '收入' : '支出'}
            {successInfo ? ` ¥${formatMoney(successInfo.amount)}` : ''}
          </p>
          {successInfo?.date ? (
            <p className="success-dialog__date">{successInfo.date}</p>
          ) : null}
        </div>
      </Modal>
    </>
  )
}
