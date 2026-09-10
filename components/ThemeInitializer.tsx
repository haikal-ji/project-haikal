'use client'

import { useEffect } from 'react'

const STORAGE_KEY = 'haikal-theme'

export default function ThemeInitializer() {
  useEffect(() => {
    const item = window.localStorage.getItem(STORAGE_KEY)
    const isDark = item === 'dark' || item === null
    document.documentElement.classList.toggle('dark', isDark)
    window.dispatchEvent(new Event('haikal-theme-change'))
  }, [])

  return null
}
