/**
 * 平台能力统一入口。
 *
 * 业务代码只从这里导入，例如：
 *   import { isNative, openUrl, writeTextFileWithFallback } from '../platform'
 */
import { isAndroidRuntime, isNativeRuntime, isTauriRuntime } from './detect'
import * as tauri from './tauri/native'
import * as web from './web/browser'

export const isNative = isNativeRuntime
export const isTauri = isTauriRuntime
export const isAndroid = isAndroidRuntime

function impl() {
  return isTauriRuntime() ? tauri : web
}

export function openUrl(url) {
  return impl().openUrl(url)
}

export function nativeFetch(url, init) {
  return impl().nativeFetch?.(url, init) ?? null
}

export function getNativeAppVersion() {
  return impl().getNativeAppVersion()
}

export function downloadAndInstallApk(url, onProgress) {
  return impl().downloadAndInstallApk(url, onProgress)
}

export function writeTextFileWithFallback(filename, content) {
  return impl().writeTextFileWithFallback(filename, content)
}

export function revealItemInDir(path) {
  return impl().revealItemInDir(path)
}
