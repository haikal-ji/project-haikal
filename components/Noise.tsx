'use client'

import React, { useRef, useEffect } from 'react'

interface NoiseProps {
  patternSize?: number
  patternScaleX?: number
  patternScaleY?: number
  patternRefreshInterval?: number
  patternAlpha?: number
  className?: string
}

const Noise: React.FC<NoiseProps> = ({
  patternSize = 250,
  patternRefreshInterval = 3,
  patternAlpha = 14,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Ukuran tile pattern untuk butiran grain yang halus (1:1 physical pixel, tidak melar/chunky)
    const size = Math.min(Math.max(patternSize || 250, 150), 300)
    const offscreen = document.createElement('canvas')
    offscreen.width = size
    offscreen.height = size
    const ctx = offscreen.getContext('2d')
    if (!ctx) return

    // Pre-bake 3 frame grain halus sekali saja saat mount (bebas alokasi di animation loop)
    const dataUrls: string[] = []
    for (let f = 0; f < 3; f++) {
      const imgData = ctx.createImageData(size, size)
      const d = imgData.data
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0
        d[i] = v
        d[i + 1] = v
        d[i + 2] = v
        d[i + 3] = patternAlpha
      }
      ctx.putImageData(imgData, 0, 0)
      dataUrls.push(offscreen.toDataURL('image/png'))
    }

    const el = containerRef.current
    if (!el) return

    el.style.backgroundImage = `url(${dataUrls[0]})`
    el.style.backgroundRepeat = 'repeat'
    el.style.backgroundSize = `${size}px ${size}px`

    // Di perangkat mobile / layar sentuh: cukup gunakan tekstur statis 1 frame.
    // Tidak menjalankan loop requestAnimationFrame sama sekali -> 0% beban CPU, scroll tetap super ringan 60/120fps.
    const isMobile =
      typeof window !== 'undefined' &&
      (window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches)

    if (isMobile) {
      return
    }

    let current = 0
    let count = 0
    let animId: number

    const tick = () => {
      count++
      if (count % patternRefreshInterval === 0) {
        current = (current + 1) % dataUrls.length
        if (el) {
          el.style.backgroundImage = `url(${dataUrls[current]})`
        }
      }
      animId = requestAnimationFrame(tick)
    }

    animId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(animId)
    }
  }, [patternSize, patternRefreshInterval, patternAlpha])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 w-full h-full z-20 select-none ${className}`}
    />
  )
}

export default Noise
