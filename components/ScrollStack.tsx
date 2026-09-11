'use client'

import React, { useLayoutEffect, useEffect, useRef, useCallback, useState } from 'react'
import type { ReactNode } from 'react'
import Lenis from 'lenis'

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export interface ScrollStackItemProps {
  itemClassName?: string
  children: ReactNode
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({ children, itemClassName = '' }) => (
  <div
    className={`scroll-stack-card relative w-full min-h-[16rem] sm:min-h-[20rem] my-3 sm:my-8 p-6 sm:p-10 md:p-12 rounded-[24px] sm:rounded-[36px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.6)] border border-text-secondary/20 bg-background dark:bg-[#141414] md:backdrop-blur-xl box-border origin-top transition-colors duration-300 ${itemClassName}`.trim()}
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

// ─── Mobile: CSS sticky stacking with 100% native compositor scroll (zero JS lag) ──
const MobileScrollStack: React.FC<Pick<ScrollStackProps, 'children' | 'className'>> = ({
  children,
  className = '',
}) => {
  const items = React.Children.toArray(children)
  return (
    <div className={`relative w-full pb-12 ${className}`.trim()}>
      <div className="w-full relative">
        {items.map((child, idx) => (
          <div
            key={idx}
            className="sticky transition-transform duration-200"
            style={{
              top: `${80 + idx * 16}px`,
              zIndex: idx + 1,
              marginBottom: idx < items.length - 1 ? '24px' : '0px',
            }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Desktop: full JS-driven stacked scroll animation ────────────────────────
const DesktopScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = '',
  itemDistance = 60,
  itemScale = 0.03,
  itemStackDistance = 25,
  stackPosition = '22%',
  scaleEndPosition = '12%',
  baseScale = 0.9,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = true,
  onStackComplete,
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const stackCompletedRef = useRef(false)
  const animationFrameRef = useRef<number | null>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const cardsRef = useRef<HTMLElement[]>([])
  const lastTransformsRef = useRef(new Map<number, { translateY: number; scale: number; rotation: number; blur: number }>())
  const isUpdatingRef = useRef(false)
  const cachedOffsetsRef = useRef<number[]>([])
  const rafScheduledRef = useRef(false)

  const calculateProgress = useCallback((scrollTop: number, start: number, end: number) => {
    if (scrollTop < start) return 0
    if (scrollTop > end) return 1
    if (start === end) return 0
    return (scrollTop - start) / (end - start)
  }, [])

  const parsePercentage = useCallback((value: string | number, containerHeight: number) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight
    }
    return parseFloat(value as string)
  }, [])

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY || window.pageYOffset || 0,
        containerHeight: window.innerHeight || 800,
      }
    } else {
      const scroller = scrollerRef.current
      return {
        scrollTop: scroller ? scroller.scrollTop : 0,
        containerHeight: scroller ? scroller.clientHeight : 800,
      }
    }
  }, [useWindowScroll])

  const getElementOffset = useCallback(
    (element: HTMLElement) => {
      if (!useWindowScroll && scrollerRef.current) {
        return element.offsetTop
      }
      const rect = element.getBoundingClientRect()
      return rect.top + (window.scrollY || window.pageYOffset || 0)
    },
    [useWindowScroll]
  )

  const cacheOffsets = useCallback(() => {
    cachedOffsetsRef.current = cardsRef.current.map((card) => {
      if (!card) return 0
      if (!useWindowScroll && scrollerRef.current) return card.offsetTop
      const rect = card.getBoundingClientRect()
      return rect.top + (window.scrollY || window.pageYOffset || 0)
    })
  }, [useWindowScroll])

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return

    isUpdatingRef.current = true

    const { scrollTop, containerHeight } = getScrollData()
    const stackPositionPx = parsePercentage(stackPosition, containerHeight)
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight)

    const endElement = scrollerRef.current?.querySelector('.scroll-stack-end') as HTMLElement | null
    const endElementTop = endElement ? getElementOffset(endElement) : 0

    cardsRef.current.forEach((card, i) => {
      if (!card) return

      const cardTop = cachedOffsetsRef.current[i] ?? getElementOffset(card)
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i
      const triggerEnd = cardTop - scaleEndPositionPx
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i
      const pinEnd = endElementTop > 0 ? endElementTop - containerHeight / 2 : pinStart + 400

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd)
      const targetScale = baseScale + i * itemScale
      const scale = Math.max(0.7, 1 - scaleProgress * (1 - targetScale))
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0

      let blur = 0
      if (blurAmount) {
        let topCardIndex = 0
        for (let j = 0; j < cardsRef.current.length; j++) {
          const jCardTop = cachedOffsetsRef.current[j] ?? getElementOffset(cardsRef.current[j])
          const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j
          if (scrollTop >= jTriggerStart) {
            topCardIndex = j
          }
        }
        if (i < topCardIndex) {
          const depthInStack = topCardIndex - i
          blur = Math.max(0, depthInStack * blurAmount)
        }
      }

      let translateY = 0
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd

      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i
      }

      const newTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100,
      }

      const lastTransform = lastTransformsRef.current.get(i)
      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
        Math.abs(lastTransform.blur - newTransform.blur) > 0.1

      if (hasChanged) {
        const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`
        const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : ''

        card.style.transform = transform
        card.style.filter = filter

        lastTransformsRef.current.set(i, newTransform)
      }

      if (i === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true
          onStackComplete?.()
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false
        }
      }
    })

    isUpdatingRef.current = false
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    onStackComplete,
    calculateProgress,
    parsePercentage,
    getScrollData,
    getElementOffset,
  ])

  const handleScroll = useCallback(() => {
    if (rafScheduledRef.current) return
    rafScheduledRef.current = true
    requestAnimationFrame(() => {
      rafScheduledRef.current = false
      updateCardTransforms()
    })
  }, [updateCardTransforms])

  const setupLenis = useCallback(() => {
    try {
      if (useWindowScroll) {
        const lenis = new Lenis({
          duration: 1.0,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          infinite: false,
          wheelMultiplier: 1,
          lerp: 0.1,
          syncTouch: false,
        })

        lenis.on('scroll', handleScroll)

        const raf = (time: number) => {
          lenis.raf(time)
          animationFrameRef.current = requestAnimationFrame(raf)
        }
        animationFrameRef.current = requestAnimationFrame(raf)

        lenisRef.current = lenis
        return lenis
      } else {
        const scroller = scrollerRef.current
        if (!scroller) return

        const lenis = new Lenis({
          wrapper: scroller,
          content: scroller.querySelector('.scroll-stack-inner') as HTMLElement,
          duration: 1.0,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          infinite: false,
          gestureOrientation: 'vertical',
          wheelMultiplier: 1,
          lerp: 0.1,
          syncTouch: false,
        })

        lenis.on('scroll', handleScroll)

        const raf = (time: number) => {
          lenis.raf(time)
          animationFrameRef.current = requestAnimationFrame(raf)
        }
        animationFrameRef.current = requestAnimationFrame(raf)

        lenisRef.current = lenis
        return lenis
      }
    } catch {
      return null
    }
  }, [handleScroll, useWindowScroll])

  useIsomorphicLayoutEffect(() => {
    const rootEl = scrollerRef.current
    if (!rootEl) return

    const cards = Array.from(rootEl.querySelectorAll('.scroll-stack-card')) as HTMLElement[]
    cardsRef.current = cards
    const transformsCache = lastTransformsRef.current

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`
      }
      card.style.willChange = 'transform'
      card.style.transformOrigin = 'top center'
      card.style.backfaceVisibility = 'hidden'
      card.style.transform = 'translateZ(0)'
    })

    setupLenis()
    cacheOffsets()
    updateCardTransforms()

    const handleResize = () => {
      cacheOffsets()
      handleScroll()
    }

    if (useWindowScroll) {
      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('resize', handleResize, { passive: true })
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (lenisRef.current) {
        lenisRef.current.destroy()
      }
      if (useWindowScroll) {
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', handleResize)
      }
      stackCompletedRef.current = false
      cardsRef.current = []
      transformsCache.clear()
      isUpdatingRef.current = false
    }
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    setupLenis,
    cacheOffsets,
    updateCardTransforms,
    handleScroll,
  ])

  return (
    <div
      ref={scrollerRef}
      className={`relative w-full ${
        useWindowScroll ? 'overflow-visible' : 'h-full overflow-y-auto'
      } ${className}`.trim()}
    >
      <div className="scroll-stack-inner w-full">
        {children}
        <div className="scroll-stack-end w-full h-[25vh]" />
      </div>
    </div>
  )
}

// ─── Public component: auto-detects mobile and switches implementation ────────
const ScrollStack: React.FC<ScrollStackProps> = (props) => {
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  useEffect(() => {
    const check = () =>
      setIsMobile(
        window.matchMedia('(pointer: coarse)').matches ||
          'ontouchstart' in window ||
          window.innerWidth < 768
      )
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  // SSR / first paint: render nothing special (avoid hydration mismatch)
  if (isMobile === null) {
    return (
      <div className={`relative w-full ${props.className ?? ''}`.trim()}>
        <div className="w-full">{props.children}</div>
      </div>
    )
  }

  if (isMobile) {
    return <MobileScrollStack className={props.className} children={props.children} />
  }

  return <DesktopScrollStack {...props} />
}

export default ScrollStack
