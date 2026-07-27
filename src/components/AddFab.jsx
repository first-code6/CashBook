import { useState } from 'react'
import TransactionForm from './TransactionForm'

export default function AddFab({ defaultDate }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        className="add-fab"
        aria-label="记一笔"
        onClick={() => setOpen(true)}
      >
        +
      </button>

      <TransactionForm
        open={open}
        defaultDate={defaultDate}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
