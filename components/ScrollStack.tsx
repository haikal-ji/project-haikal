'use client'

import React, { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

export interface ScrollStackItemProps {
  itemClassName?: string
  children: ReactNode
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({ children, itemClassName = '' }) => (
  <div
    className={`scroll-stack-card relative w-full min-h-[16rem] sm:min-h-[20rem] p-6 sm:p-10 md:p-12 rounded-[24px] sm:rounded-[36px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.6)] border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-[#141416] box-border origin-top transition-transform duration-150 ease-out will-change-transform ${itemClassName}`.trim()}
    style={{
      backfaceVisibility: 'hidden',
      transformStyle: 'preserve-3d',
    }}
  >
    {children}
  </div>
)

interface ScrollStackProps {
  className?: string
  children: ReactNode
  itemDistance?: number
  itemScale?: number
  itemStackDistance?: number
  stackPosition?: string
  scaleEndPosition?: string
  baseScale?: number
  scaleDuration?: number
  rotationAmount?: number
  blurAmount?: number
  useWindowScroll?: boolean
  onStackComplete?: () => void
}

/**
 * High-performance, GPU-accelerated ScrollStack.
 *
 * Uses native browser CSS `position: sticky` for card pinning on both desktop and mobile.
 * This guarantees 100% silky smooth 60fps/120fps scrolling on trackpad, mousewheel, and touch,
 * completely eliminating scroll stuttering (patah-patah) caused by JS-driven translateY pinning.
 *
 * Subtle card scaling is applied via a zero-reflow RAF loop that reads cached element offsets.
 */
const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = '',
  itemDistance = 50,
  itemScale = 0.03,
  itemStackDistance = 28,
  baseScale = 0.92,
}) => {
  const items = React.Children.toArray(children)
  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRefs = useRef<(HTMLDivElement | null)[]>([])
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const cachedTopsRef = useRef<number[]>([])
  const rafIdRef = useRef<number | null>(null)
  const [isDesktop, setIsDesktop] = useState(false)

  // Detect screen size for responsive top offsets
  useEffect(() => {
    const check = () => {
      setIsDesktop(window.innerWidth >= 768)
    }
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  // Cache static offsets once on mount/resize (zero layout thrashing during scroll)
  useEffect(() => {
    const computeOffsets = () => {
      cachedTopsRef.current = wrapperRefs.current.map((el) => {
        if (!el) return 0
        let top = 0
        let cur: HTMLElement | null = el
        while (cur) {
          top += cur.offsetTop
          cur = cur.offsetParent as HTMLElement | null
        }
        return top
      })
    }

    computeOffsets()
    // Re-compute after images or fonts load
    const timeout = setTimeout(computeOffsets, 500)
    window.addEventListener('resize', computeOffsets, { passive: true })

    return () => {
      clearTimeout(timeout)
      window.removeEventListener('resize', computeOffsets)
    }
  }, [items.length])

  // Zero-reflow subtle scale effect on scroll
  useEffect(() => {
    let lastScrollY = -1

    const updateScales = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0
      if (Math.abs(scrollY - lastScrollY) < 1) return
      lastScrollY = scrollY

      const tops = cachedTopsRef.current
      const total = items.length

      for (let i = 0; i < total; i++) {
        const cardEl = cardRefs.current[i]
        if (!cardEl) continue

        // Cards underneath the top card scale down progressively
        let scale = 1.0

        // Look at cards stacked after this one
        for (let j = i + 1; j < total; j++) {
          const nextTop = tops[j]
          if (nextTop > 0) {
            // How close next card is to stacking over card i
            const distance = nextTop - scrollY
            const stackWindow = 350
            if (distance < stackWindow) {
              const progress = Math.max(0, Math.min(1, (stackWindow - distance) / stackWindow))
              scale -= progress * (itemScale || 0.03)
            }
          }
        }

        const clampedScale = Math.max(baseScale, Math.min(1.0, scale))
        const roundedScale = Math.round(clampedScale * 1000) / 1000
        cardEl.style.transform = `scale(${roundedScale}) translateZ(0)`
      }
    }

    const onScroll = () => {
      if (rafIdRef.current) return
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null
        updateScales()
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    updateScales()

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
      window.removeEventListener('scroll', onScroll)
    }
  }, [items.length, baseScale, itemScale])

  // Responsive offsets:
  // Desktop header is ~68px, so 92px leaves 24px clean margin below navbar
  const baseTop = isDesktop ? 92 : 76
  const stackStep = isDesktop ? (itemStackDistance || 28) : 18
  const marginDist = isDesktop ? Math.max(itemDistance, 72) : Math.max(itemDistance, 40)

  return (
    <div ref={containerRef} className={`relative w-full pb-16 ${className}`.trim()}>
      <div className="w-full relative flex flex-col">
        {items.map((child, idx) => (
          <div
            key={idx}
            ref={(el) => {
              wrapperRefs.current[idx] = el
            }}
            className="sticky will-change-transform"
            style={{
              top: `${baseTop + idx * stackStep}px`,
              zIndex: idx + 1,
              marginBottom: idx < items.length - 1 ? `${marginDist}px` : '0px',
            }}
          >
            <div
              ref={(el) => {
                cardRefs.current[idx] = el
              }}
              className="w-full origin-top transition-transform duration-75 ease-out will-change-transform"
            >
              {child}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ScrollStack
