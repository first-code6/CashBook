/**
 * 平台能力统一入口。
 *
 * 业务代码只从这里导入，例如：
 *   import { isNative, openUrl, writeTextFileWithFallback } from '../platform'
 *
 * 以后若不用 Tauri：
 *   1. 删掉 platform/tauri/
 *   2. 把本文件里的 native 路由改成新实现（或始终走 web）
 */
import { isNativeRuntime, isTauriRuntime } from './detect'
import * as tauri from './tauri/native'
import * as web from './web/browser'

export const isNative = isNativeRuntime
export const isTauri = isTauriRuntime

function impl() {
  return isTauriRuntime() ? tauri : web
}

export function openUrl(url) {
  return impl().openUrl(url)
}

export function writeTextFileWithFallback(filename, content) {
  return impl().writeTextFileWithFallback(filename, content)
}

export function revealItemInDir(path) {
  return impl().revealItemInDir(path)
}
