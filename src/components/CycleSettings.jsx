import { useState } from 'react'
import { Button, Card, Modal } from 'animal-island-ui'
import DayPicker from './DayPicker'
import { useCashbook } from '../context/CashbookContext'
import { normalizeCycleStartDay } from '../lib/billingCycle'

export default function CycleSettings() {
  const { state, updateSettings } = useCashbook()
  const savedDay = normalizeCycleStartDay(state.settings.cycleStartDay)
  const [open, setOpen] = useState(false)
  const [draftDay, setDraftDay] = useState(String(savedDay))

  const handleOpen = () => {
    setDraftDay(String(savedDay))
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleConfirm = () => {
    const day = normalizeCycleStartDay(draftDay)
    updateSettings({ cycleStartDay: day })
    setOpen(false)
  }

  return (
    <Card color="app-teal" pattern="default" className="island-panel island-panel--cycle">
      <button
        type="button"
        className="cycle-settings__entry"
        onClick={handleOpen}
        aria-label={`账期开始日，每月 ${savedDay} 号，点击修改`}
      >
        <span className="cycle-settings__label">账期开始日</span>
        <span className="cycle-settings__value">每月 {savedDay} 号</span>
        <span className="cycle-settings__chevron" aria-hidden="true">
          ›
        </span>
      </button>

      <Modal
        open={open}
        title="选择账期开始日"
        typewriter={false}
        onClose={handleClose}
        footer={
          <div className="form-actions">
            <Button onClick={handleClose}>取消</Button>
            <Button type="primary" onClick={handleConfirm}>
              确认
            </Button>
          </div>
        }
      >
        <div className="cycle-settings__modal">
          <p className="cycle-settings__hint">点选每月开始日（最晚 28 号），确认后生效</p>
          <DayPicker value={draftDay} onChange={setDraftDay} />
        </div>
      </Modal>
    </Card>
  )
}
