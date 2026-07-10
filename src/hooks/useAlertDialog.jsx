import { useCallback, useState } from 'react'
import AlertDialog from '../components/AlertDialog'

export function useAlertDialog() {
  const [state, setState] = useState({
    open: false,
    title: '提示',
    message: '',
    confirmText: '知道了',
  })

  const showAlert = useCallback((message, options = {}) => {
    setState({
      open: true,
      title: options.title || '提示',
      message,
      confirmText: options.confirmText || '知道了',
    })
  }, [])

  const closeAlert = useCallback(() => {
    setState((current) => ({ ...current, open: false }))
  }, [])

  const alertDialog = (
    <AlertDialog
      open={state.open}
      title={state.title}
      message={state.message}
      confirmText={state.confirmText}
      onClose={closeAlert}
    />
  )

  return { showAlert, alertDialog }
}
