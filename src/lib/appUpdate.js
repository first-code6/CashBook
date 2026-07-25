import { env } from './env'
import {
  downloadAndInstallApk,
  getNativeAppVersion,
  isNative,
  nativeFetch,
  openUrl,
} from '../platform'

// 远程更新配置来自环境变量：
//   VITE_APP_VERSION          —— 构建期版本（应与 tauri.conf.json version 一致）
//   VITE_UPDATE_MANIFEST_URL  —— 远程 update.json
// JSON 结构示例：
// { "version": "0.2.0", "url": "https://your.host/jizhangben-0.2.0.apk", "notes": "更新内容" }
export const APP_VERSION = env.appVersion
export const UPDATE_MANIFEST_URL = env.updateManifestUrl

function parseVersion(version) {
  return String(version || '')
    .trim()
    .replace(/^v/i, '')
    .split('.')
    .map((part) => Number.parseInt(part, 10) || 0)
}

// 返回 1 表示 a > b，-1 表示 a < b，0 表示相等。
export function compareVersions(a, b) {
  const left = parseVersion(a)
  const right = parseVersion(b)
  const length = Math.max(left.length, right.length)
  for (let i = 0; i < length; i += 1) {
    const diff = (left[i] || 0) - (right[i] || 0)
    if (diff !== 0) return diff > 0 ? 1 : -1
  }
  return 0
}

/**
 * 当前运行版本：
 * - Android / Tauri：优先用原生 getVersion()（= tauri.conf.json / versionName）
 * - Web：回退 VITE_APP_VERSION
 */
export async function getCurrentAppVersion() {
  const native = await getNativeAppVersion()
  return (native || APP_VERSION || '0.0.0').trim()
}

// 拉取远程版本信息并与当前版本比较。
// 返回 { hasUpdate, current, latest, url, notes }，无网络/未配置时抛出错误。
export async function checkForUpdate() {
  if (!UPDATE_MANIFEST_URL) {
    throw new Error('尚未配置更新地址（VITE_UPDATE_MANIFEST_URL）')
  }

  const current = await getCurrentAppVersion()
  const manifestUrl = `${UPDATE_MANIFEST_URL}?t=${Date.now()}`
  const requestInit = { method: 'GET', cache: 'no-store' }

  // Android / Tauri：用插件 HTTP，避免 WebView CORS 导致 Failed to fetch
  let response
  try {
    response = (await nativeFetch(manifestUrl, requestInit)) || (await fetch(manifestUrl, requestInit))
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`检查更新失败：${message || '网络请求被拒绝'}`)
  }

  if (!response.ok) {
    throw new Error(`检查更新失败（${response.status}）`)
  }

  const data = await response.json()
  if (!data || typeof data.version !== 'string') {
    throw new Error('更新信息格式不正确')
  }

  const hasUpdate = compareVersions(data.version, current) > 0

  return {
    hasUpdate,
    current,
    latest: data.version,
    url: typeof data.url === 'string' ? data.url : '',
    notes: typeof data.notes === 'string' ? data.notes : '',
  }
}

/**
 * 执行更新：
 * - Android 原生：下载 APK → 申请安装权限 → 调起系统安装界面
 * - 其他环境：打开下载链接，由用户手动安装
 *
 * 注意：Android 不允许完全静默安装，系统安装确认框无法跳过。
 */
export async function applyUpdate(url, onProgress) {
  if (!url) throw new Error('暂无下载地址')

  if (isNative()) {
    return downloadAndInstallApk(url, onProgress)
  }

  await openUrl(url)
  return { method: 'browser' }
}

// 打开下载链接（系统浏览器 / 下载器），下载后由用户手动安装 APK。
export function openDownloadUrl(url) {
  if (!url) return
  void openUrl(url)
}
