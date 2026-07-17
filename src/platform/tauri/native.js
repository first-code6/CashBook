/**
 * Tauri 实现层：所有 @tauri-apps/* 依赖只允许出现在本目录。
 * 若不再使用 Tauri，删除本文件并改 platform/index.js 的路由即可。
 */
import { isTauriRuntime } from '../detect'

export async function openUrl(url) {
  if (!url || !isTauriRuntime()) return false

  try {
    const opener = window.__TAURI__?.opener
    if (opener && typeof opener.openUrl === 'function') {
      await opener.openUrl(url)
      return true
    }
  } catch {
    // fall through
  }

  try {
    const { openUrl: open } = await import('@tauri-apps/plugin-opener')
    await open(url)
    return true
  } catch {
    return false
  }
}

/**
 * 写入文本文件，按候选目录依次尝试。
 * @returns {Promise<{ path: string, method: 'file' }>}
 */
export async function writeTextFileWithFallback(filename, content) {
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
          pathApi.documentDir
        ) {
          const root = await pathApi.documentDir()
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

export async function revealItemInDir(path) {
  if (!path || !isTauriRuntime()) return false
  try {
    const { revealItemInDir } = await import('@tauri-apps/plugin-opener')
    await revealItemInDir(path)
    return true
  } catch {
    return false
  }
}
