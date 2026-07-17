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
