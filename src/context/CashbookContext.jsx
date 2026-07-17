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
    ({ name, type, parentId = null, icon = 'other' }) => {
      const trimmed = name.trim()
      if (!trimmed) return { ok: false, message: '分类名称不能为空' }

      const prev = stateRef.current
      const normalizedParentId =
        typeof parentId === 'string' && parentId ? parentId : null

      if (normalizedParentId) {
        const parent = prev.categories.find((item) => item.id === normalizedParentId)
        if (!parent) return { ok: false, message: '上级分类不存在' }
        if (parent.type !== type) return { ok: false, message: '上级分类类型不匹配' }
        if (parent.parentId) return { ok: false, message: '只能添加在一级分类下' }
      }

      const exists = prev.categories.some(
        (item) =>
          item.type === type &&
          (item.parentId || null) === normalizedParentId &&
          item.name === trimmed,
      )
      if (exists) return { ok: false, message: '同级已有相同名称' }

      commit((current) => ({
        categories: [
          ...current.categories,
          {
            id: createId(),
            name: trimmed,
            type,
            parentId: normalizedParentId,
            icon: icon || 'other',
          },
        ],
      }))

      return { ok: true }
    },
    [commit],
  )

  const updateCategory = useCallback(
    (id, patch) => {
      const prev = stateRef.current
      const target = prev.categories.find((item) => item.id === id)
      if (!target) return { ok: false, message: '分类不存在' }

      const nextName =
        patch.name != null ? String(patch.name).trim() : target.name
      if (!nextName) return { ok: false, message: '分类名称不能为空' }

      const nextIcon =
        patch.icon != null ? String(patch.icon).trim() || 'other' : target.icon

      const siblingClash = prev.categories.some(
        (item) =>
          item.id !== id &&
          item.type === target.type &&
          (item.parentId || null) === (target.parentId || null) &&
          item.name === nextName,
      )
      if (siblingClash) return { ok: false, message: '同级已有相同名称' }

      commit((current) => ({
        categories: current.categories.map((item) =>
          item.id === id ? { ...item, name: nextName, icon: nextIcon } : item,
        ),
      }))

      return { ok: true }
    },
    [commit],
  )

  const deleteCategory = useCallback(
    (id) => {
      const prev = stateRef.current
      const hasChildren = prev.categories.some((item) => item.parentId === id)
      if (hasChildren) {
        return { ok: false, message: '请先删除该分类下的子分类' }
      }

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

  const exportData = useCallback(() => exportToFile(stateRef.current), [])

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
      updateCategory,
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
      updateCategory,
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
