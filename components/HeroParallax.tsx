'use client'

import { useEffect, useRef, type ReactNode } from 'react'

export default function HeroParallax({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    function update() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (!ref.current) return
        const offset = Math.min(window.scrollY * 0.12, 72)
        ref.current.style.setProperty('--parallax-y', `${offset}px`)
      })
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', update)
    }
  }, [])

  return <div ref={ref} className="hero-collage hero-parallax" aria-label="Kolase tekstur dan bentuk alami">{children}</div>
}
