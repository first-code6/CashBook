import CycleOverview from '../components/CycleOverview'
import AddFab from '../components/AddFab'
import { useCashbook } from '../context/CashbookContext'
import { useCycleOverview } from '../hooks/useCycleStats'
import { getToday } from '../lib/date'

export default function HomePage() {
  const { state } = useCashbook()
  const overview = useCycleOverview(
    state.transactions,
    state.settings.cycleStartDay,
  )

  return (
    <div className="page page--home">
      <CycleOverview
        cycleLabel={overview.cycleLabel}
        cycleRange={overview.cycleRange}
        income={overview.income}
        expense={overview.expense}
        balance={overview.balance}
        count={overview.count}
        progress={overview.progress}
      />

      <AddFab defaultDate={getToday()} />
    </div>
  )
}
