'use client'

import { useEffect } from 'react'

export default function ThemeInitializer() {
  useEffect(() => {
    window.dispatchEvent(new Event('haikal-theme-change'))
  }, [])

  return null
}
