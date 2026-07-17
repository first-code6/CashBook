import { useEffect, useMemo, useState } from 'react'
import { Button, Card } from 'animal-island-ui'
import DayPicker from './DayPicker'
import SectionHeading from './SectionHeading'
import { useCashbook } from '../context/CashbookContext'
import { useAlertDialog } from '../hooks/useAlertDialog'
import { formatCycleRange, getCurrentCycle, normalizeCycleStartDay } from '../lib/billingCycle'

export default function CycleSettings() {
  const { state, updateSettings } = useCashbook()
  const { showAlert, alertDialog } = useAlertDialog()
  const [day, setDay] = useState(String(normalizeCycleStartDay(state.settings.cycleStartDay)))

  useEffect(() => {
    setDay(String(normalizeCycleStartDay(state.settings.cycleStartDay)))
  }, [state.settings.cycleStartDay])

  const preview = useMemo(() => {
    const cycle = getCurrentCycle(Number(day))
    return formatCycleRange(cycle)
  }, [day])

  const handleSave = () => {
    const nextDay = normalizeCycleStartDay(day)
    updateSettings({ cycleStartDay: nextDay })
    showAlert(`账期已更新为每月 ${nextDay} 号开始\n当前账期：${preview}`, {
      title: '设置成功',
      confirmText: '好的',
    })
  }

  return (
    <Card color="app-teal" pattern="default" className="island-panel">
      <div className="island-panel__head">
        <SectionHeading tone="teal">账期开始日</SectionHeading>
      </div>
      <p className="island-panel__desc">
        点选每月账期开始日（最晚 28 号）。账期从该日开始，到下个月同一天的前一天结束。
      </p>
      <div className="form-field">
        <span className="form-field__label">每月开始日（1–28）</span>
        <DayPicker value={day} onChange={setDay} />
      </div>
      <p className="cycle-settings__preview">
        已选：每月 {day} 号 · 当前预览：{preview}
      </p>
      <Button type="primary" block onClick={handleSave}>
        保存账期
      </Button>
      {alertDialog}
    </Card>
  )
}
