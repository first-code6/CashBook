/**
 * 运行环境探测。业务代码请通过 `platform` 使用能力，不要直接读 __TAURI__。
 */
export function isTauriRuntime() {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window
}

/** 是否在原生壳里（当前仅 Tauri；以后可扩展 Capacitor 等） */
export function isNativeRuntime() {
  return isTauriRuntime()
}

/** 是否 Android（WebView UA；用于启动时自动检查更新等） */
export function isAndroidRuntime() {
  if (typeof navigator === 'undefined') return false
  return /Android/i.test(navigator.userAgent || '')
}
