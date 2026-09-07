'use client'

import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'haikal-theme'

function subscribe(callback: () => void) {
  window.addEventListener('haikal-theme-change', callback)
  return () => window.removeEventListener('haikal-theme-change', callback)
}

function getSnapshot() {
  return document.documentElement.classList.contains('dark')
}

function getServerSnapshot() {
  return false
}

export default function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  function toggleTheme() {
    const next = !dark
    document.documentElement.classList.toggle('dark', next)
    window.localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light')
    window.dispatchEvent(new Event('haikal-theme-change'))
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={dark ? 'Gunakan mode terang' : 'Gunakan mode gelap'}
      title={dark ? 'Mode terang' : 'Warm espresso'}
    >
      {dark ? '☼' : '◐'}
    </button>
  )
}
