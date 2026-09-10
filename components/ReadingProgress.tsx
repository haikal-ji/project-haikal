'use client'

import { useEffect, useState } from 'react'

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let ticking = false

    function updateProgress() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setProgress(scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0)
      ticking = false
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress)
        ticking = true
      }
    }

    updateProgress()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return <div className="reading-progress" style={{ width: `${progress}%` }} aria-hidden="true" />
}
