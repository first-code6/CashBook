import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'
import { Button, Tag } from 'animal-island-ui'
import CategoryIcon from './CategoryIcon'
import { getCategoryIconName, getCategoryPathLabel } from '../lib/categories'
import { formatMoney } from '../lib/money'

const STAR_COUNT = 14
const PAGE_ENTER_MS = 750
const PAGE_STAGGER_MS = 100
const BURST_MS = 900
const EXIT_SLIDE_MS = 320
const EXIT_COLLAPSE_MS = 280
const EXIT_MS = EXIT_SLIDE_MS + EXIT_COLLAPSE_MS + 80
const FLASH_MS = 1100

function edgePoint(angle) {
  const dx = Math.cos(angle)
  const dy = Math.sin(angle)
  const sx = Math.abs(dx) < 1e-6 ? Number.POSITIVE_INFINITY : 0.5 / Math.abs(dx)
  const sy = Math.abs(dy) < 1e-6 ? Number.POSITIVE_INFINITY : 0.5 / Math.abs(dy)
  const scale = Math.min(sx, sy)
  return { x: dx * scale, y: dy * scale, dx, dy }
}

function buildStars(box, tone = 'add') {
  const side = Math.min(box.width || 280, box.height || 64)
  const vwCap =
    typeof window !== 'undefined' ? Math.min(window.innerWidth, window.innerHeight) * 0.045 : 28
  const flyBase = Math.min(tone === 'edit' ? 26 : 30, Math.max(12, side * 0.14, vwCap * 0.55))
  const sizeBig = Math.min(16, Math.max(11, side * 0.1 + 4))
  const sizeSmall = Math.max(9, sizeBig - 3)

  return Array.from({ length: STAR_COUNT }, (_, i) => {
    const angle = (Math.PI * 2 * i) / STAR_COUNT - Math.PI / 2
    const edge = edgePoint(angle)
    const fly = flyBase + (i % 3) * (flyBase * 0.18)
    return {
      i,
      left: `${(0.5 + edge.x) * 100}%`,
      top: `${(0.5 + edge.y) * 100}%`,
      dx: Math.round(edge.dx * fly),
      dy: Math.round(edge.dy * fly),
      size: i % 2 === 0 ? sizeBig : sizeSmall,
    }
  })
}

function RoundedStarIcon() {
  return (
    <svg className="history-item__star-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2.6l2.7 6.2 6.7.6-5.1 4.5 1.5 6.5L12 16.8 6.2 20.4l1.5-6.5L2.6 9.4l6.7-.6L12 2.6z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

function itemFingerprint(item) {
  return [
    item.type,
    item.amount,
    item.categoryId,
    item.note || '',
    item.date,
    item.updatedAt || '',
  ].join('|')
}

function StarBurst({ anchorRef, tone = 'add' }) {
  const [box, setBox] = useState(null)
  const stars = useMemo(() => (box ? buildStars(box, tone) : []), [box, tone])

  useLayoutEffect(() => {
    const el = anchorRef?.current
    if (!el) return undefined

    const update = () => {
      const rect = el.getBoundingClientRect()
      setBox({
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      })
    }

    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [anchorRef])

  if (!box || stars.length === 0) return null

  const pad = Math.max(20, Math.min(36, Math.min(box.width, box.height) * 0.2))

  return createPortal(
    <div
      className={`history-burst-layer history-burst-layer--${tone}`}
      style={{
        left: box.left - pad,
        top: box.top - pad,
        width: box.width + pad * 2,
        height: box.height + pad * 2,
      }}
      aria-hidden="true"
    >
      {stars.map((star) => {
        const xRatio = Number.parseFloat(star.left) / 100
        const yRatio = Number.parseFloat(star.top) / 100
        return (
          <span
            key={star.i}
            className={`history-item__star history-item__star--${star.i % 3}`}
            style={{
              left: pad + xRatio * box.width,
              top: pad + yRatio * box.height,
              '--dx': `${star.dx}px`,
              '--dy': `${star.dy}px`,
              '--star-size': `${star.size}px`,
            }}
          >
            <RoundedStarIcon />
          </span>
        )
      })}
    </div>,
    document.body,
  )
}

function HistoryRow({
  item,
  index,
  categories,
  awaiting,
  pageEnter,
  showBurst,
  burstTone,
  flashing,
  exiting,
  onEdit,
  onDelete,
  onExitEnd,
}) {
  const rowRef = useRef(null)
  const wrapRef = useRef(null)
  const className = [
    'history-item',
    awaiting && !exiting ? 'history-item--pending' : '',
    pageEnter && !exiting ? 'history-item--enter' : '',
    showBurst ? 'history-item--burst' : '',
    flashing ? 'history-item--flash' : '',
    exiting ? 'history-item--exit' : '',
  ]
    .filter(Boolean)
    .join(' ')

  // 先锁像素高度 → 滑出 → 再收高度/边距，避免收尾一帧跳变
  useLayoutEffect(() => {
    const wrap = wrapRef.current
    if (!exiting || !wrap) return undefined

    const styles = window.getComputedStyle(wrap)
    const mb = styles.marginBottom
    const height = wrap.getBoundingClientRect().height
    wrap.style.boxSizing = 'border-box'
    wrap.style.height = `${height}px`
    wrap.style.marginBottom = mb
    wrap.style.overflow = 'hidden'
    wrap.style.flexShrink = '0'
    // 强制回流，确保浏览器先提交「固定高度」再开过渡
    void wrap.offsetHeight

    let raf = 0
    const slideTimer = window.setTimeout(() => {
      raf = requestAnimationFrame(() => {
        wrap.style.transition = `height ${EXIT_COLLAPSE_MS}ms cubic-bezier(0.4, 0, 0.2, 1), margin-bottom ${EXIT_COLLAPSE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`
        wrap.style.height = '0px'
        wrap.style.marginBottom = '0px'
        wrap.style.paddingTop = '0px'
        wrap.style.paddingBottom = '0px'
      })
    }, EXIT_SLIDE_MS)

    const doneTimer = window.setTimeout(() => onExitEnd?.(item.id), EXIT_MS)

    return () => {
      window.clearTimeout(slideTimer)
      window.clearTimeout(doneTimer)
      cancelAnimationFrame(raf)
    }
  }, [exiting, item.id, onExitEnd])

  return (
    <div
      ref={wrapRef}
      className={`history-item-wrap${exiting ? ' history-item-wrap--exit' : ''}`}
    >
      <div
        ref={rowRef}
        className={className}
        style={
          pageEnter && !exiting
            ? {
                '--enter-i': index,
                '--enter-dur': `${PAGE_ENTER_MS}ms`,
                '--enter-stagger': `${PAGE_STAGGER_MS}ms`,
              }
            : undefined
        }
      >
        <button
          type="button"
          className="history-item__main"
          onClick={() => !exiting && onEdit?.(item)}
          aria-label="编辑记录"
          disabled={exiting}
        >
          <p className="history-item__category">
            <CategoryIcon
              name={getCategoryIconName(categories, item.categoryId)}
              size={24}
            />
            {getCategoryPathLabel(categories, item.categoryId)}
            <Tag color={item.type === 'income' ? 'app-teal' : 'app-red'} size="small">
              {item.type === 'income' ? '收入' : '支出'}
            </Tag>
          </p>
          <p className="history-item__note">{item.note || '无备注'}</p>
        </button>
        <div className="history-item__side">
          <strong className={item.type === 'income' ? 'text-income' : 'text-expense'}>
            {item.type === 'income' ? '+' : '-'}
            {formatMoney(item.amount)}
          </strong>
          <div className="history-item__actions">
            <Button size="small" disabled={exiting} onClick={() => onEdit?.(item)}>
              编辑
            </Button>
            <Button
              size="small"
              danger
              disabled={exiting}
              onClick={() => onDelete?.(item.id)}
            >
              删除
            </Button>
          </div>
        </div>
      </div>
      {showBurst ? <StarBurst anchorRef={rowRef} tone={burstTone} /> : null}
    </div>
  )
}

/** 单日流水：进页入场；新添/修改边缘迸发；删除退场（保持原位） */
export default function TransactionDayList({
  items,
  categories,
  onEdit,
  onDelete,
  emptyText = '这一天没有记录',
}) {
  const location = useLocation()
  const prevMapRef = useRef(new Map())
  const skipBurstRef = useRef(true) // 切页/首屏灌入时不触发新添迸发
  const [wave, setWave] = useState(0)
  const [awaiting, setAwaiting] = useState(true)
  const [pageEnter, setPageEnter] = useState(false)
  const [burstIds, setBurstIds] = useState(() => new Set())
  const [burstTone, setBurstTone] = useState(() => new Map())
  const [flashIds, setFlashIds] = useState(() => new Set())
  /** 保序行：删除时原地标记 exiting，不挪到列表末尾 */
  const [rows, setRows] = useState(() => [])

  const resetVisual = useCallback(() => {
    skipBurstRef.current = true
    setAwaiting(true)
    setPageEnter(false)
    setBurstIds(new Set())
    setBurstTone(new Map())
    setFlashIds(new Set())
    setWave((n) => n + 1)
    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        setAwaiting(false)
        setPageEnter(true)
      })
    })
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [])

  useEffect(() => {
    prevMapRef.current = new Map()
    skipBurstRef.current = true
    setRows([])
    return resetVisual()
  }, [location.pathname, resetVisual])

  useEffect(() => {
    if (!pageEnter) return undefined
    const liveCount = rows.filter((row) => !row.exiting).length
    const ms = Math.max(liveCount, 1) * PAGE_STAGGER_MS + PAGE_ENTER_MS + 80
    const timer = window.setTimeout(() => setPageEnter(false), ms)
    return () => window.clearTimeout(timer)
  }, [pageEnter, rows, wave])

  useEffect(() => {
    const itemMap = new Map(items.map((item) => [item.id, item]))
    const prevMap = prevMapRef.current
    const prevIds = [...prevMap.keys()]
    const nextIds = items.map((item) => item.id)
    const prevSet = new Set(prevIds)
    const nextSet = new Set(nextIds)
    const hydrate = skipBurstRef.current || prevMap.size === 0

    const added = nextIds.filter((id) => !prevSet.has(id))
    const removed = prevIds.filter((id) => !nextSet.has(id))
    // 切页 / 换账期等整表替换：大量增减同时发生，不当作新添
    const listSwap = added.length > 0 && removed.length > 0
    const edited = nextIds.filter((id) => {
      if (!prevSet.has(id)) return false
      const old = prevMap.get(id)
      const cur = itemMap.get(id)
      return old && cur && itemFingerprint(old) !== itemFingerprint(cur)
    })
    // 仅「真正新添一条」才星爆，避免切页误触发
    const burstAddIds =
      !hydrate && !listSwap && added.length === 1 ? added : []

    setRows((current) => {
      if (current.length === 0) {
        return items.map((item) => ({ item, exiting: false }))
      }

      const exitingKept = current.filter(
        (row) => row.exiting && !itemMap.has(row.item.id),
      )
      const newlyGone = current.filter(
        (row) => !row.exiting && !itemMap.has(row.item.id),
      )

      const liveRows = items.map((item) => ({ item, exiting: false }))
      const result = [...liveRows]

      const exits = [...exitingKept, ...newlyGone.map((row) => ({ ...row, exiting: true }))]
        .map((row) => ({
          row: { item: row.item, exiting: true },
          index: current.findIndex((c) => c.item.id === row.item.id),
        }))
        .filter((entry) => entry.index >= 0)
        .sort((a, b) => a.index - b.index)

      for (const { row, index } of exits) {
        let liveBefore = 0
        for (let i = 0; i < index; i += 1) {
          if (itemMap.has(current[i].item.id)) liveBefore += 1
        }
        const exitingBefore = exits.filter((entry) => entry.index < index).length
        const insertAt = Math.min(liveBefore + exitingBefore, result.length)
        result.splice(insertAt, 0, row)
      }

      return result
    })

    if (burstAddIds.length > 0) {
      setBurstIds((current) => {
        const next = new Set(current)
        burstAddIds.forEach((id) => next.add(id))
        return next
      })
      setBurstTone((current) => {
        const next = new Map(current)
        burstAddIds.forEach((id) => next.set(id, 'add'))
        return next
      })
      window.setTimeout(() => {
        setBurstIds((current) => {
          const next = new Set(current)
          burstAddIds.forEach((id) => next.delete(id))
          return next
        })
        setBurstTone((current) => {
          const next = new Map(current)
          burstAddIds.forEach((id) => next.delete(id))
          return next
        })
      }, BURST_MS)
    }

    if (edited.length > 0 && !hydrate && !listSwap) {
      setFlashIds((current) => {
        const next = new Set(current)
        edited.forEach((id) => next.add(id))
        return next
      })
      setBurstIds((current) => {
        const next = new Set(current)
        edited.forEach((id) => next.add(id))
        return next
      })
      setBurstTone((current) => {
        const next = new Map(current)
        edited.forEach((id) => next.set(id, 'edit'))
        return next
      })
      window.setTimeout(() => {
        setFlashIds((current) => {
          const next = new Set(current)
          edited.forEach((id) => next.delete(id))
          return next
        })
        setBurstIds((current) => {
          const next = new Set(current)
          edited.forEach((id) => next.delete(id))
          return next
        })
        setBurstTone((current) => {
          const next = new Map(current)
          edited.forEach((id) => next.delete(id))
          return next
        })
      }, Math.max(FLASH_MS, BURST_MS))
    }

    prevMapRef.current = new Map(items.map((item) => [item.id, item]))
    // 首屏/切页灌入完成后再允许新添迸发
    if (hydrate || listSwap) {
      skipBurstRef.current = false
    }
  }, [items])

  const handleExitEnd = useCallback((id) => {
    setRows((current) => current.filter((row) => row.item.id !== id))
  }, [])

  if (rows.length === 0) {
    return emptyText ? <p className="empty-text">{emptyText}</p> : null
  }

  return (
    <div className="day-detail__list" data-wave={wave}>
      {rows.map((row, index) => {
        const tone = burstTone.get(row.item.id) || 'add'
        return (
          <HistoryRow
            key={row.item.id}
            item={row.item}
            index={index}
            categories={categories}
            awaiting={awaiting}
            pageEnter={pageEnter && !burstIds.has(row.item.id) && !row.exiting}
            showBurst={burstIds.has(row.item.id) && !row.exiting}
            burstTone={tone}
            flashing={flashIds.has(row.item.id) && !row.exiting}
            exiting={row.exiting}
            onEdit={onEdit}
            onDelete={onDelete}
            onExitEnd={handleExitEnd}
          />
        )
      })}
    </div>
  )
}
