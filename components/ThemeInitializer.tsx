'use client'

import { useEffect } from 'react'

const STORAGE_KEY = 'haikal-theme'

export default function ThemeInitializer() {
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) === 'dark'
    document.documentElement.classList.toggle('dark', saved)
    window.dispatchEvent(new Event('haikal-theme-change'))
  }, [])

  return null
}
