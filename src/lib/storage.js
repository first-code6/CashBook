import { DEFAULT_CATEGORIES } from '../data/defaultCategories'
import { normalizeCycleStartDay } from './billingCycle'

const STORAGE_KEY = 'cashbook.v1'
const BACKUP_KEY = 'cashbook.v1.backup'

export function createInitialState() {
  return {
    version: 1,
    categories: DEFAULT_CATEGORIES.map((category) => ({ ...category })),
    transactions: [],
    settings: {
      cycleStartDay: 1,
    },
  }
}

function sanitizeCategories(categories, fallback) {
  if (!Array.isArray(categories)) return fallback

  const cleaned = categories
    .filter(
      (item) =>
        item &&
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        (item.type === 'income' || item.type === 'expense'),
    )
    .map((item) => ({
      id: item.id,
      name: item.name,
      type: item.type,
    }))

  return cleaned.length > 0 ? cleaned : fallback
}

function sanitizeTransactions(transactions) {
  if (!Array.isArray(transactions)) return []

  return transactions
    .filter(
      (item) =>
        item &&
        typeof item.id === 'string' &&
        (item.type === 'income' || item.type === 'expense') &&
        typeof item.amount === 'number' &&
        Number.isFinite(item.amount) &&
        typeof item.categoryId === 'string' &&
        typeof item.date === 'string',
    )
    .map((item) => ({
      id: item.id,
      type: item.type,
      amount: item.amount,
      categoryId: item.categoryId,
      note: typeof item.note === 'string' ? item.note : '',
      date: item.date,
      createdAt:
        typeof item.createdAt === 'string' ? item.createdAt : new Date().toISOString(),
    }))
}

export function normalizeState(raw) {
  const base = createInitialState()
  if (!raw || typeof raw !== 'object') return base

  return {
    version: 1,
    categories: sanitizeCategories(raw.categories, base.categories),
    transactions: sanitizeTransactions(raw.transactions),
    settings: {
      cycleStartDay: normalizeCycleStartDay(
        raw.settings?.cycleStartDay ?? base.settings.cycleStartDay,
      ),
    },
  }
}

function readRaw(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeRaw(key, value) {
  try {
    localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

function parseStored(raw) {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    return normalizeState(parsed)
  } catch {
    return null
  }
}

export function loadState() {
  const primary = parseStored(readRaw(STORAGE_KEY))
  if (primary) return primary

  const backup = parseStored(readRaw(BACKUP_KEY))
  if (backup) {
    // Restore primary from backup when possible.
    saveState(backup)
    return backup
  }

  return createInitialState()
}

export function saveState(state) {
  const normalized = normalizeState(state)
  const payload = JSON.stringify(normalized)
  const ok = writeRaw(STORAGE_KEY, payload)
  writeRaw(BACKUP_KEY, payload)
  return ok
}

export function getStorageSnapshot() {
  return loadState()
}
