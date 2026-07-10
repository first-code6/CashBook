const DAYS = Array.from({ length: 28 }, (_, index) => index + 1)

export default function DayPicker({ value, onChange }) {
  const selected = Number(value)

  return (
    <div className="day-picker" role="listbox" aria-label="每月开始日">
      {DAYS.map((day) => {
        const active = selected === day
        return (
          <button
            key={day}
            type="button"
            role="option"
            aria-selected={active}
            className={`day-picker__day${active ? ' day-picker__day--active' : ''}`}
            onClick={() => onChange(String(day))}
          >
            {day}
          </button>
        )
      })}
    </div>
  )
}
