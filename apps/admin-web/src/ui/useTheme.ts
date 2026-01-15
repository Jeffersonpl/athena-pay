// Simple theme hook with named export (shared between admin/web)
import { useEffect, useState } from 'react'

export type ThemeMode = 'light' | 'dark'
const STORAGE_KEY = 'athena.theme'

export function useTheme(): [ThemeMode, (t: ThemeMode) => void] {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light'
    return (localStorage.getItem(STORAGE_KEY) as ThemeMode) || 'light'
  })

  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    root.dataset.theme = mode
    try { localStorage.setItem(STORAGE_KEY, mode) } catch {}
  }, [mode])

  return [mode, setMode]
}
