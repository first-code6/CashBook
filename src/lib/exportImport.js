import { createInitialState, normalizeState } from './storage'

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

function isTauri() {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window
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

async function writeWithFallback(filename, content) {
  const { writeTextFile, BaseDirectory } = await import('@tauri-apps/plugin-fs')

  const candidates = [
    { baseDir: BaseDirectory.Download, label: '下载目录' },
    { baseDir: BaseDirectory.AppDocument, label: '应用文档目录' },
    { baseDir: BaseDirectory.AppData, label: '应用数据目录' },
  ]

  let lastError = null
  for (const candidate of candidates) {
    try {
      await writeTextFile(filename, content, {
        baseDir: candidate.baseDir,
        create: true,
      })

      let fullPath = `${candidate.label}/${filename}`
      try {
        const pathApi = await import('@tauri-apps/api/path')
        if (candidate.baseDir === BaseDirectory.Download && pathApi.downloadDir) {
          fullPath = await pathApi.join(await pathApi.downloadDir(), filename)
        } else if (
          candidate.baseDir === BaseDirectory.AppDocument &&
          pathApi.appDataDir
        ) {
          // AppDocument 在部分平台映射到 app data 下 documents
          const root = pathApi.documentDir
            ? await pathApi.documentDir()
            : await pathApi.appDataDir()
          fullPath = await pathApi.join(root, filename)
        } else if (pathApi.appDataDir) {
          fullPath = await pathApi.join(await pathApi.appDataDir(), filename)
        }
      } catch {
        // keep label path
      }

      return { path: fullPath, method: 'file' }
    } catch (error) {
      lastError = error
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('无法写入文件，请检查存储权限')
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

  if (isTauri()) {
    return writeWithFallback(filename, content)
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
  if (!isTauri() || !path) return
  try {
    const { revealItemInDir } = await import('@tauri-apps/plugin-opener')
    await revealItemInDir(path)
  } catch {
    // ignore
  }
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
