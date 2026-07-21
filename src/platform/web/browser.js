/**
 * Web / 浏览器回退实现。
 */
export async function openUrl(url) {
  if (!url || typeof window === 'undefined') return false

  const opened = window.open(url, '_blank', 'noopener')
  if (!opened) {
    window.location.href = url
  }
  return true
}

export async function getNativeAppVersion() {
  return ''
}

export async function downloadAndInstallApk() {
  throw new Error('浏览器环境请直接下载 APK 后手动安装')
}

export async function writeTextFileWithFallback() {
  throw new Error('当前环境不支持原生文件写入')
}

export async function revealItemInDir() {
  return false
}
