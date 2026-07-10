import { createInitialState, normalizeState } from './storage'
import { normalizeCycleStartDay } from './billingCycle'

export function validateImportData(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('文件内容无效')
  }

  if (data.version !== 1) {
    throw new Error('不支持的数据版本')
  }

  if (!Array.isArray(data.categories) || !Array.isArray(data.transactions)) {
    throw new Error('数据结构不完整')
  }

  for (const category of data.categories) {
    if (!category.id || !category.name || !['income', 'expense'].includes(category.type)) {
      throw new Error('分类数据格式错误')
    }
  }

  for (const transaction of data.transactions) {
    if (
      !transaction.id ||
      !['income', 'expense'].includes(transaction.type) ||
      typeof transaction.amount !== 'number' ||
      !transaction.categoryId ||
      !transaction.date
    ) {
      throw new Error('流水数据格式错误')
    }
  }

  if (data.settings?.cycleStartDay != null) {
    const day = Number(data.settings.cycleStartDay)
    if (!Number.isInteger(day) || day < 1 || day > 28) {
      throw new Error('账期起始日需为 1-28 的整数')
    }
  }

  return normalizeState(data)
}

export function exportToFile(state) {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const filename = `cashbook-${year}-${month}-${day}.json`
  const blob = new Blob([JSON.stringify(normalizeState(state), null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function readImportFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result))
        resolve(validateImportData(parsed))
      } catch (error) {
        reject(error instanceof Error ? error : new Error('文件解析失败'))
      }
    }

    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsText(file)
  })
}

export function getEmptyState() {
  return createInitialState()
}
