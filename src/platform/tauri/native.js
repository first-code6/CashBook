/**
 * Tauri 实现层：所有 @tauri-apps/* / 原生插件依赖只允许出现在本目录。
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
 * 读取原生壳版本（与 tauri.conf.json / Android versionName 一致）。
 */
export async function getNativeAppVersion() {
  if (!isTauriRuntime()) return ''
  try {
    const { getVersion } = await import('@tauri-apps/api/app')
    return (await getVersion()) || ''
  } catch {
    return ''
  }
}

/**
 * Android：下载 APK 到应用缓存，并调起系统安装器。
 * @param {string} url
 * @param {(percent: number) => void} [onProgress]
 * @returns {Promise<{ path: string }>}
 */
export async function downloadAndInstallApk(url, onProgress) {
  if (!url || !isTauriRuntime()) {
    throw new Error('当前环境不支持应用内安装')
  }

  const { download } = await import('@tauri-apps/plugin-upload')
  const { appCacheDir, join } = await import('@tauri-apps/api/path')
  const {
    canInstall,
    requestInstallPermission,
    install,
  } = await import('tauri-plugin-android-installer-api')

  const path = await join(await appCacheDir(), `cashbook-update-${Date.now()}.apk`)

  await download(url, path, (payload) => {
    if (!onProgress) return
    const total = Number(payload?.total || 0)
    const done = Number(payload?.progressTotal || 0)
    if (total > 0) {
      onProgress(Math.min(100, Math.round((done / total) * 100)))
    }
  })

  if (!(await canInstall())) {
    await requestInstallPermission()
    if (!(await canInstall())) {
      throw new Error('请允许本应用安装未知应用后，再继续更新')
    }
  }

  await install(path)
  return { path }
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
  for (const item of candidates) {
    try {
      await writeTextFile(filename, content, { baseDir: item.baseDir })
      return { path: `${item.label}/${filename}`, method: 'file' }
    } catch (error) {
      lastError = error
    }
  }

  throw lastError instanceof Error ? lastError : new Error('无法写入文件')
}

export async function revealItemInDir(path) {
  try {
    const { revealItemInDir: reveal } = await import('@tauri-apps/plugin-opener')
    await reveal(path)
    return true
  } catch {
    return false
  }
}
