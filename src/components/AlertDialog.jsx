import { Button, Modal } from 'animal-island-ui'

export default function AlertDialog({
  open,
  title = '提示',
  message,
  confirmText = '知道了',
  onClose,
}) {
  return (
    <Modal
      open={open}
      title={title}
      typewriter={false}
      onClose={onClose}
      onOk={onClose}
      footer={
        <div className="form-actions">
          <Button type="primary" onClick={onClose}>
            {confirmText}
          </Button>
        </div>
      }
    >
      <p className="alert-dialog__message">{message}</p>
    </Modal>
  )
}
