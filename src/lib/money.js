export function yuanToFen(value) {
  const normalized = String(value).trim().replace(/,/g, '')
  if (!normalized) return 0

  const amount = Number(normalized)
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error('金额格式不正确')
  }

  return Math.round(amount * 100)
}

export function fenToYuan(fen) {
  return (fen / 100).toFixed(2)
}

export function formatMoney(fen) {
  const yuan = fen / 100
  return yuan.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
