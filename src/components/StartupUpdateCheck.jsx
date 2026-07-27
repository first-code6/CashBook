import { useEffect, useRef, useState } from 'react'
import { checkForUpdate, UPDATE_MANIFEST_URL } from '../lib/appUpdate'
import { isAndroid, isNative } from '../platform'
import UpdateAvailableModal from './UpdateAvailableModal'

/** 开发预览：进入即展示更新弹窗 */
const PREVIEW_UPDATE_MODAL = false

const PREVIEW_UPDATE_INFO = {
  hasUpdate: true,
  current: '0.2.0',
  latest: '0.3.0',
  url: 'https://example.com/cashbook-0.3.0.apk',
  notes: '修复若干问题，优化记账体验。',
}

/**
 * Android 原生：冷启动进入 App 时静默检查更新，有新版本则弹窗，单击「更新」安装。
 * 网络失败 / 未配置地址时不打扰用户。
 */
export default function StartupUpdateCheck() {
  const checkedRef = useRef(false)
  const [updateInfo, setUpdateInfo] = useState(() =>
    PREVIEW_UPDATE_MODAL ? PREVIEW_UPDATE_INFO : null,
  )

  useEffect(() => {
    if (PREVIEW_UPDATE_MODAL) return
    if (checkedRef.current) return
    if (!isNative() || !isAndroid()) return
    if (!UPDATE_MANIFEST_URL) return

    checkedRef.current = true
    let cancelled = false

    ;(async () => {
      try {
        const result = await checkForUpdate()
        if (!cancelled && result.hasUpdate) {
          setUpdateInfo(result)
        }
      } catch {
        // 启动自检失败静默忽略
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <UpdateAvailableModal
      open={Boolean(updateInfo)}
      updateInfo={updateInfo}
      confirmText="更新"
      onClose={() => setUpdateInfo(null)}
    />
  )
}
