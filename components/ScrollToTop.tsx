'use client'

import { useEffect, useState, useRef } from 'react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  const circleRef = useRef<SVGCircleElement>(null)

  // SVG Progress circle calculations
  const size = 46
  const strokeWidth = 2.5
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    let currentOffset = circumference
    let targetOffset = circumference
    let rafId: number | null = null
    let isAnimating = false

    function animate() {
      // Lerp interpolation (0.18) for buttery smooth liquid motion
      const diff = targetOffset - currentOffset
      if (Math.abs(diff) > 0.08) {
        currentOffset += diff * 0.18
        if (circleRef.current) {
          circleRef.current.style.strokeDashoffset = `${currentOffset}`
        }
        rafId = requestAnimationFrame(animate)
      } else {
        currentOffset = targetOffset
        if (circleRef.current) {
          circleRef.current.style.strokeDashoffset = `${currentOffset}`
        }
        isAnimating = false
      }
    }

    function onScroll() {
      const scrollY = window.scrollY || window.pageYOffset || 0
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const percent = scrollHeight > 0 ? Math.min(100, Math.max(0, (scrollY / scrollHeight) * 100)) : 0

      targetOffset = circumference - (percent / 100) * circumference

      // Hanya update state React saat status visibility berubah (mencegah lag / re-render)
      const shouldBeVisible = scrollY > 350
      setVisible((prev) => (prev !== shouldBeVisible ? shouldBeVisible : prev))

      if (!isAnimating) {
        isAnimating = true
        rafId = requestAnimationFrame(animate)
      }
    }

    // Set initial position
    const initialScrollY = window.scrollY || window.pageYOffset || 0
    const initialScrollHeight = document.documentElement.scrollHeight - window.innerHeight
    const initialPercent = initialScrollHeight > 0 ? Math.min(100, Math.max(0, (initialScrollY / initialScrollHeight) * 100)) : 0
    currentOffset = circumference - (initialPercent / 100) * circumference
    targetOffset = currentOffset

    if (circleRef.current) {
      circleRef.current.style.strokeDashoffset = `${currentOffset}`
    }
    if (initialScrollY > 350) {
      setVisible(true)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [circumference])

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-6 pointer-events-none'
      }`}
    >
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Kembali ke atas"
        title="Kembali ke atas"
        className="group relative flex items-center justify-center w-[46px] h-[46px] rounded-full bg-background/85 dark:bg-[#141416]/85 backdrop-blur-xl border border-text-secondary/20 dark:border-white/10 shadow-[0_8px_25px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_14px_40px_rgba(0,0,0,0.7)] text-text-primary hover:border-text-primary/40 dark:hover:border-white/30 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
      >
        {/* SVG Circular Scroll Progress Ring */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-text-secondary/15 dark:text-white/10"
          />
          {/* Animated Liquid Progress Stroke - driven by RAF Lerp for 120fps fluidity */}
          <circle
            ref={circleRef}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            strokeLinecap="round"
            className="text-text-primary will-change-transform"
          />
        </svg>

        {/* Up Arrow Icon */}
        <svg
          className="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>

        {/* Floating Tooltip */}
        <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-text-primary text-background font-medium text-[11px] tracking-tight whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md">
          Ke Atas
        </span>
      </button>
    </div>
  )
}
