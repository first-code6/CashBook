import { useState } from 'react'
import { Button, Modal } from 'animal-island-ui'
import { useAlertDialog } from '../hooks/useAlertDialog'
import { applyUpdate } from '../lib/appUpdate'
import { isNative } from '../platform'

/**
 * 发现新版本弹窗：展示说明，单击「更新」下载并安装（Android）或打开下载链接。
 */
export default function UpdateAvailableModal({
  updateInfo,
  open,
  onClose,
  confirmText = '更新',
}) {
  const { showAlert, alertDialog } = useAlertDialog()
  const [updating, setUpdating] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleClose = () => {
    if (updating) return
    onClose?.()
  }

  const handleApply = async () => {
    if (!updateInfo?.url) {
      showAlert('暂无下载地址', { title: '更新失败' })
      return
    }

    setUpdating(true)
    setProgress(0)
    try {
      await applyUpdate(updateInfo.url, setProgress)
      if (!isNative()) {
        onClose?.()
        showAlert('已打开下载链接，请下载完成后手动安装', {
          title: '开始下载',
          confirmText: '好的',
        })
      }
      // Android：安装器调起后进程可能被替换，不一定执行到这里
    } catch (error) {
      showAlert(error instanceof Error ? error.message : '更新失败', {
        title: '更新失败',
      })
    } finally {
      setUpdating(false)
    }
  }

  return (
    <>
      <Modal
        open={open}
        title="发现新版本"
        typewriter={false}
        onClose={handleClose}
        footer={
          <div className="form-actions">
            <Button disabled={updating} onClick={handleClose}>
              稍后
            </Button>
            <Button type="primary" loading={updating} onClick={handleApply}>
              {confirmText}
            </Button>
          </div>
        }
      >
        <div className="settings-update-body">
          <p className="settings-update-notes">
            新版本 v{updateInfo?.latest}
            {updateInfo?.current ? `（当前 v${updateInfo.current}）` : ''}
            {updateInfo?.notes ? `\n${updateInfo.notes}` : ''}
            {!updateInfo?.url ? '\n暂无下载地址' : ''}
            {isNative() ? '\n\n下载完成后将自动打开系统安装界面。' : ''}
          </p>
          {updating ? (
            <div className="update-progress" aria-label={`下载进度 ${progress}%`}>
              <div className="update-progress__track">
                <div
                  className="update-progress__bar"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="update-progress__text">
                {progress >= 100 ? '正在调起安装…' : `下载中 ${progress}%`}
              </p>
            </div>
          ) : null}
        </div>
      </Modal>
      {alertDialog}
    </>
  )
}
