// 远程更新配置：把 UPDATE_MANIFEST_URL 指向你部署的版本信息 JSON。
// JSON 结构示例：
// { "version": "0.2.0", "url": "https://your.host/jizhangben-0.2.0.apk", "notes": "更新内容" }
//
// APP_VERSION 需与 tauri.conf.json / tauri.properties 里的版本保持一致。
export const APP_VERSION = '0.1.0'
export const UPDATE_MANIFEST_URL = ''

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

// 拉取远程版本信息并与当前版本比较。
// 返回 { hasUpdate, current, latest, url, notes }，无网络/未配置时抛出错误。
export async function checkForUpdate() {
  if (!UPDATE_MANIFEST_URL) {
    throw new Error('尚未配置更新地址（UPDATE_MANIFEST_URL）')
  }

  const response = await fetch(`${UPDATE_MANIFEST_URL}?t=${Date.now()}`, {
    method: 'GET',
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`检查更新失败（${response.status}）`)
  }

  const data = await response.json()
  if (!data || typeof data.version !== 'string') {
    throw new Error('更新信息格式不正确')
  }

  const hasUpdate = compareVersions(data.version, APP_VERSION) > 0

  return {
    hasUpdate,
    current: APP_VERSION,
    latest: data.version,
    url: typeof data.url === 'string' ? data.url : '',
    notes: typeof data.notes === 'string' ? data.notes : '',
  }
}

// 打开下载链接（系统浏览器 / 下载器），下载后由用户手动安装 APK。
export function openDownloadUrl(url) {
  if (!url) return
  try {
    const opener = typeof window !== 'undefined' ? window.__TAURI__?.opener : null
    if (opener && typeof opener.openUrl === 'function') {
      opener.openUrl(url)
      return
    }
  } catch {
    // fall through to window.open
  }

  if (typeof window !== 'undefined') {
    const opened = window.open(url, '_blank', 'noopener')
    if (!opened) {
      window.location.href = url
    }
  }
}
