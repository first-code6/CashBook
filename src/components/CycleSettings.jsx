import { useEffect, useMemo, useState } from 'react'
import { Button, Card, Title } from 'animal-island-ui'
import DayPicker from './DayPicker'
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
    <section className="settings-section">
      <div className="section-title">
        <Title size="large" color="app-teal">
          账期设置
        </Title>
      </div>
      <Card color="app-teal" pattern="default" className="cycle-settings">
        <p className="cycle-settings__desc">
          点选每月账期开始日（最晚 28 号，避免部分月份没有 29/30/31）。账期从该日开始，到下个月同一天的前一天结束。例如选 10
          号，则本账期为 10 日到下月 9 日。
        </p>
        <div className="form-field">
          <span className="form-field__label">每月开始日（1–28）</span>
          <DayPicker value={day} onChange={setDay} />
        </div>
        <p className="cycle-settings__preview">
          已选：每月 {day} 号 · 当前预览账期：{preview}
        </p>
        <Button type="primary" block onClick={handleSave}>
          保存账期
        </Button>
      </Card>
      {alertDialog}
    </section>
  )
}
