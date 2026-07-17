import { useEffect, useRef, useState } from 'react'

export default function Select({
  value,
  options,
  onChange,
  placeholder = '请选择',
  ariaLabel,
  disabled = false,
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  const selected = options.find((item) => String(item.value) === String(value))

  useEffect(() => {
    if (!open) return undefined

    const handlePointer = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    const handleKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('touchstart', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('touchstart', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  const handleSelect = (optionValue) => {
    onChange(optionValue)
    setOpen(false)
  }

  return (
    <div className="ui-select" ref={rootRef}>
      <button
        type="button"
        className={`ui-select__control${open ? ' ui-select__control--open' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span
          className={`ui-select__value${selected ? '' : ' ui-select__value--placeholder'}`}
        >
          {selected ? selected.label : placeholder}
        </span>
        <span className="ui-select__arrow" aria-hidden="true" />
      </button>

      {open && (
        <ul className="ui-select__menu" role="listbox" aria-label={ariaLabel}>
          {options.length === 0 ? (
            <li className="ui-select__empty">暂无选项</li>
          ) : (
            options.map((item) => {
              const active = String(item.value) === String(value)
              return (
                <li key={item.value} role="option" aria-selected={active}>
                  <button
                    type="button"
                    className={`ui-select__option${active ? ' ui-select__option--active' : ''}`}
                    onClick={() => handleSelect(item.value)}
                  >
                    {item.label}
                  </button>
                </li>
              )
            })
          )}
        </ul>
      )}
    </div>
  )
}
