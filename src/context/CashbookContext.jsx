import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { exportToFile, readImportFile } from '../lib/exportImport'
import { createId } from '../lib/id'
import { loadState, saveState } from '../lib/storage'
import { normalizeCycleStartDay } from '../lib/billingCycle'

const CashbookContext = createContext(null)

export function CashbookProvider({ children }) {
  const [state, setState] = useState(() => loadState())
  const stateRef = useRef(state)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  const commit = useCallback((updater) => {
    setState((prev) => {
      const draft = typeof updater === 'function' ? updater(prev) : updater
      if (!draft || draft === prev) return prev

      const next = {
        ...prev,
        ...draft,
        categories: draft.categories ?? prev.categories,
        transactions: draft.transactions ?? prev.transactions,
        settings: draft.settings ?? prev.settings,
        version: 1,
      }

      saveState(next)
      stateRef.current = next
      return next
    })
  }, [])

  useEffect(() => {
    const persistLatest = () => {
      saveState(stateRef.current)
    }

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        persistLatest()
      }
    }

    window.addEventListener('pagehide', persistLatest)
    window.addEventListener('beforeunload', persistLatest)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      window.removeEventListener('pagehide', persistLatest)
      window.removeEventListener('beforeunload', persistLatest)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  const addTransaction = useCallback(
    (payload) => {
      const transaction = {
        id: createId(),
        type: payload.type,
        amount: payload.amount,
        categoryId: payload.categoryId,
        note: payload.note || '',
        date: payload.date,
        createdAt: new Date().toISOString(),
      }

      commit((prev) => ({
        transactions: [transaction, ...prev.transactions],
      }))
    },
    [commit],
  )

  const deleteTransaction = useCallback(
    (id) => {
      commit((prev) => ({
        transactions: prev.transactions.filter((item) => item.id !== id),
      }))
    },
    [commit],
  )

  const addCategory = useCallback(
    (name, type) => {
      const trimmed = name.trim()
      if (!trimmed) return { ok: false, message: '分类名称不能为空' }

      const prev = stateRef.current
      const exists = prev.categories.some(
        (item) => item.type === type && item.name === trimmed,
      )
      if (exists) return { ok: false, message: '该分类已存在' }

      commit((current) => ({
        categories: [
          ...current.categories,
          { id: createId(), name: trimmed, type },
        ],
      }))

      return { ok: true }
    },
    [commit],
  )

  const deleteCategory = useCallback(
    (id) => {
      const prev = stateRef.current
      const used = prev.transactions.some((item) => item.categoryId === id)
      if (used) return { ok: false, message: '该分类仍有流水记录，无法删除' }

      commit((current) => ({
        categories: current.categories.filter((item) => item.id !== id),
      }))

      return { ok: true }
    },
    [commit],
  )

  const updateSettings = useCallback(
    (patch) => {
      commit((prev) => {
        const nextSettings = {
          ...prev.settings,
          ...patch,
        }

        if (patch.cycleStartDay != null) {
          nextSettings.cycleStartDay = normalizeCycleStartDay(patch.cycleStartDay)
        }

        return { settings: nextSettings }
      })
    },
    [commit],
  )

  const exportData = useCallback(() => {
    exportToFile(stateRef.current)
  }, [])

  const importData = useCallback(
    async (file) => {
      const imported = await readImportFile(file)
      commit(imported)
      return imported
    },
    [commit],
  )

  const value = useMemo(
    () => ({
      state,
      addTransaction,
      deleteTransaction,
      addCategory,
      deleteCategory,
      updateSettings,
      exportData,
      importData,
    }),
    [
      state,
      addTransaction,
      deleteTransaction,
      addCategory,
      deleteCategory,
      updateSettings,
      exportData,
      importData,
    ],
  )

  return (
    <CashbookContext.Provider value={value}>{children}</CashbookContext.Provider>
  )
}

export function useCashbook() {
  const context = useContext(CashbookContext)
  if (!context) {
    throw new Error('useCashbook must be used within CashbookProvider')
  }
  return context
}
