export default function SegmentedControl({
  value,
  options,
  onChange,
  ariaLabel,
  className = '',
}) {
  return (
    <div
      className={`segmented ${className}`.trim()}
      role="radiogroup"
      aria-label={ariaLabel}
    >
      {options.map((option) => {
        const active = String(value) === String(option.value)
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            className={`segmented__item${active ? ' segmented__item--active' : ''}`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
