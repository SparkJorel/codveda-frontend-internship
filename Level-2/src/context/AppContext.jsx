import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

/**
 * Application state shared across routes.
 *
 * The brief asks for state that survives navigation. A saved-repository
 * shortlist proves it concretely: you save an item on /explore, the count in
 * the header updates, and it is still there after visiting /about and coming
 * back — because the state lives above the router, not inside a page.
 *
 * It is also mirrored into localStorage so a reload does not lose the list.
 */
const AppContext = createContext(null)

const STORAGE_KEY = 'codveda.saved-repos'

function readStoredList() {
  // Private windows and storage-blocked browsers throw on access rather
  // than returning null, so this has to be guarded.
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function AppProvider({ children }) {
  const [saved, setSaved] = useState(readStoredList)
  const [recentSearches, setRecentSearches] = useState([])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
    } catch {
      // Storage unavailable — the list still works for this session.
    }
  }, [saved])

  const toggleSaved = useCallback((repo) => {
    setSaved((current) =>
      current.some((item) => item.id === repo.id)
        ? current.filter((item) => item.id !== repo.id)
        : [...current, repo]
    )
  }, [])

  const isSaved = useCallback(
    (id) => saved.some((item) => item.id === id),
    [saved]
  )

  const clearSaved = useCallback(() => setSaved([]), [])

  const rememberSearch = useCallback((term) => {
    const clean = term.trim()
    if (!clean) return
    setRecentSearches((current) =>
      [clean, ...current.filter((item) => item !== clean)].slice(0, 5)
    )
  }, [])

  const value = useMemo(
    () => ({ saved, isSaved, toggleSaved, clearSaved, recentSearches, rememberSearch }),
    [saved, isSaved, toggleSaved, clearSaved, recentSearches, rememberSearch]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used inside <AppProvider>')
  return context
}
