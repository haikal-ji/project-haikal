'use client'

import { useEffect, useState } from 'react'

export default function LoadingScreen() {
  const [visible, setVisible] = useState(false)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    // Di mobile / layar kecil atau kunjungan berulang, jangan blokir layar agar LCP tetap hijau (< 2 detik)
    if (typeof window === 'undefined') return

    const isMobile = window.innerWidth < 768
    const alreadySeen = sessionStorage.getItem('haikal_loaded')

    if (isMobile || alreadySeen) {
      return
    }

    try {
      sessionStorage.setItem('haikal_loaded', '1')
    } catch {}

    setVisible(true)

    const timer = setTimeout(() => {
      setFading(true)
    }, 400)

    const removeTimer = setTimeout(() => {
      setVisible(false)
    }, 750)

    return () => {
      clearTimeout(timer)
      clearTimeout(removeTimer)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      aria-hidden="true"
      onAnimationEnd={() => setVisible(false)}
      className={`fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center overflow-hidden transition-opacity duration-300 ease-out pointer-events-none ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Ambient center blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-text-primary/10 rounded-full blur-[100px]" />

      {/* Brand Name */}
      <div className="relative overflow-hidden h-16 flex items-center justify-center">
        <div className="text-4xl md:text-5xl font-black text-text-primary tracking-tighter">
          Haikal<span className="text-blue-500">.</span>
        </div>
      </div>

      {/* Subtitle */}
      <div className="relative overflow-hidden h-8 mt-2 flex items-center justify-center">
        <div className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase text-text-secondary">
          Portfolio Loading
        </div>
      </div>

      {/* Loading Progress Bar */}
      <div className="mt-8 w-48 md:w-64 h-[2px] bg-text-secondary/20 rounded-full overflow-hidden relative">
        <div
          className="absolute inset-y-0 left-0 w-full bg-text-primary rounded-full animate-loading-bar"
          style={{
            animation: 'loadingProgress 0.75s cubic-bezier(0.65, 0, 0.35, 1) forwards',
          }}
        />
      </div>
    </div>
  )
}
