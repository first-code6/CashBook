import { useRef, useState } from 'react'
import { Button, Card, Modal, Title } from 'animal-island-ui'
import CategoryManager from '../components/CategoryManager'
import CycleSettings from '../components/CycleSettings'
import { useCashbook } from '../context/CashbookContext'
import { useAlertDialog } from '../hooks/useAlertDialog'

export default function SettingsPage() {
  const { exportData, importData } = useCashbook()
  const { showAlert, alertDialog } = useAlertDialog()
  const fileInputRef = useRef(null)
  const [importOpen, setImportOpen] = useState(false)
  const [pendingFile, setPendingFile] = useState(null)
  const [importing, setImporting] = useState(false)

  const handlePickFile = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    setPendingFile(file)
    setImportOpen(true)
  }

  const handleExport = () => {
    exportData()
    showAlert('数据文件已开始下载', {
      title: '导出成功',
      confirmText: '好的',
    })
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

      <section className="settings-section">
        <div className="section-title">
          <Title size="large" color="app-yellow">
            数据管理
          </Title>
        </div>
        <Card color="app-yellow" pattern="default" className="data-actions">
          <Button type="primary" block onClick={handleExport}>
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
        </Card>
      </section>

      <CategoryManager />

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
