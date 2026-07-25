import { useEffect } from 'react'
import { createPortal } from 'react-dom'

/** 全屏覆盖页，盖住底部导航，适合记一笔 / 分类管理。 */
export default function FullScreenPage({ open, title, onClose, children, footer, headerRight }) {
  useEffect(() => {
    if (!open) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div className="fs-page" role="dialog" aria-modal="true" aria-label={title}>
      <header className="fs-page__header">
        <button type="button" className="fs-page__back" aria-label="返回" onClick={onClose}>
          ‹
        </button>
        <h2 className="fs-page__title">{title}</h2>
        <div className="fs-page__header-right">{headerRight || null}</div>
      </header>
      <div className="fs-page__body">{children}</div>
      {footer ? <footer className="fs-page__footer">{footer}</footer> : null}
    </div>,
    document.body,
  )
}
