import { createInitialState, normalizeState } from './storage'
import { isNative, revealItemInDir, writeTextFileWithFallback } from '../platform'

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

function buildFilename() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `cashbook-${year}-${month}-${day}.json`
}

async function tryShareFile(filename, content) {
  if (typeof navigator === 'undefined' || typeof File === 'undefined') return false
  if (typeof navigator.share !== 'function') return false

  const file = new File([content], filename, { type: 'application/json' })
  const payload = { files: [file], title: filename }

  if (typeof navigator.canShare === 'function' && !navigator.canShare(payload)) {
    return false
  }

  await navigator.share(payload)
  return true
}

// 返回 { path, method }：web 触发下载；Android 优先系统分享，失败再写本地。
export async function exportToFile(state) {
  const filename = buildFilename()
  const content = JSON.stringify(normalizeState(state), null, 2)

  // Android / 支持分享的环境：让用户直接选保存位置（下载、网盘等）
  try {
    const shared = await tryShareFile(filename, content)
    if (shared) {
      return { path: filename, method: 'share' }
    }
  } catch (error) {
    // 用户取消分享不算失败
    if (error instanceof Error && /abort|cancel|AbortError/i.test(error.name + error.message)) {
      throw new Error('已取消导出')
    }
    // 分享失败则继续走文件写入
  }

  if (isNative()) {
    return writeTextFileWithFallback(filename, content)
  }

  const blob = new Blob([content], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)

  return { path: filename, method: 'download' }
}

// 尝试在文件管理器中定位导出的文件（Android 上可能不支持，忽略失败）。
export async function revealExportedFile(path) {
  await revealItemInDir(path)
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
