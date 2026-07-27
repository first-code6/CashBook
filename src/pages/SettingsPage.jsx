import { useEffect, useRef, useState } from 'react'
import { Button, Card, Modal } from 'animal-island-ui'
import CategoryManager from '../components/CategoryManager'
import CycleSettings from '../components/CycleSettings'
import SectionHeading from '../components/SectionHeading'
import UpdateAvailableModal from '../components/UpdateAvailableModal'
import { useCashbook } from '../context/CashbookContext'
import { useAlertDialog } from '../hooks/useAlertDialog'
import { checkForUpdate, getCurrentAppVersion } from '../lib/appUpdate'
import { isNative } from '../platform'

export default function SettingsPage() {
  const { exportData, importData } = useCashbook()
  const { showAlert, alertDialog } = useAlertDialog()
  const fileInputRef = useRef(null)
  const [importOpen, setImportOpen] = useState(false)
  const [pendingFile, setPendingFile] = useState(null)
  const [importing, setImporting] = useState(false)
  const [checking, setChecking] = useState(false)
  const [updateInfo, setUpdateInfo] = useState(null)
  const [exporting, setExporting] = useState(false)
  const [displayVersion, setDisplayVersion] = useState('')

  useEffect(() => {
    let cancelled = false
    getCurrentAppVersion().then((version) => {
      if (!cancelled) setDisplayVersion(version)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const handleCheckUpdate = async () => {
    setChecking(true)
    try {
      const result = await checkForUpdate()
      setDisplayVersion(result.current)
      if (result.hasUpdate) {
        setUpdateInfo(result)
      } else {
        showAlert(`当前已是最新版本（v${result.current}）`, {
          title: '检查更新',
          confirmText: '好的',
        })
      }
    } catch (error) {
      showAlert(error instanceof Error ? error.message : '检查更新失败', {
        title: '检查更新',
      })
    } finally {
      setChecking(false)
    }
  }

  const handlePickFile = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    setPendingFile(file)
    setImportOpen(true)
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const result = await exportData()
      if (result?.method === 'share') {
        showAlert('请在系统分享面板中选择「保存到文件」或发送到其他应用', {
          title: '导出成功',
          confirmText: '好的',
        })
      } else if (result?.path) {
        showAlert(`已保存到：\n${result.path}`, {
          title: '导出成功',
          confirmText: '好的',
        })
      } else {
        showAlert('数据文件已开始下载', {
          title: '导出成功',
          confirmText: '好的',
        })
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : '导出失败'
      if (message === '已取消导出') return
      showAlert(message, { title: '导出失败' })
    } finally {
      setExporting(false)
    }
  }

  const handleConfirmImport = async () => {
    if (!pendingFile) return

    setImporting(true)
    try {
      await importData(pendingFile)
      setImportOpen(false)
      setPendingFile(null)
      showAlert('数据导入成功，当前数据已被覆盖', {
        title: '导入成功',
        confirmText: '好的',
      })
    } catch (error) {
      showAlert(error instanceof Error ? error.message : '导入失败', {
        title: '导入失败',
      })
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="page page--settings">
      <CycleSettings />

      <Card color="app-yellow" pattern="default" className="island-panel">
        <div className="island-panel__head">
          <SectionHeading tone="yellow">备份与恢复</SectionHeading>
        </div>
        <div className="data-actions">
          <Button type="primary" block loading={exporting} onClick={handleExport}>
            导出数据文件
          </Button>
          <Button block onClick={() => fileInputRef.current?.click()}>
            导入数据文件
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={handlePickFile}
          />
        </div>
      </Card>

      <CategoryManager />

      <Card color="app-blue" pattern="default" className="island-panel island-panel--quiet">
        <div className="settings-update__row">
          <span className="settings-version">
            版本 v{displayVersion || '…'}
          </span>
          <Button size="small" loading={checking} onClick={handleCheckUpdate}>
            检查更新
          </Button>
        </div>
      </Card>

      <UpdateAvailableModal
        open={Boolean(updateInfo)}
        updateInfo={updateInfo}
        confirmText={isNative() ? '下载并安装' : '下载'}
        onClose={() => setUpdateInfo(null)}
      />

      <Modal
        open={importOpen}
        title="确认导入"
        typewriter={false}
        onClose={() => {
          if (importing) return
          setImportOpen(false)
          setPendingFile(null)
        }}
        footer={
          <div className="form-actions">
            <Button
              disabled={importing}
              onClick={() => {
                setImportOpen(false)
                setPendingFile(null)
              }}
            >
              取消
            </Button>
            <Button type="primary" loading={importing} onClick={handleConfirmImport}>
              确认覆盖
            </Button>
          </div>
        }
      >
        <p>
          导入将覆盖当前所有记账数据，此操作不可撤销。确认要导入
          {pendingFile ? `「${pendingFile.name}」` : '该文件'}吗？
        </p>
      </Modal>

      {alertDialog}
    </div>
  )
}
