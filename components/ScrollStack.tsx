'use client'

import React, { useLayoutEffect, useEffect, useRef, useCallback } from 'react'
import type { ReactNode } from 'react'
import Lenis from 'lenis'

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export interface ScrollStackItemProps {
  itemClassName?: string
  children: ReactNode
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({ children, itemClassName = '' }) => (
  <div
    className={`scroll-stack-card relative w-full min-h-[18rem] sm:min-h-[20rem] my-6 sm:my-8 p-6 sm:p-10 md:p-12 rounded-[28px] sm:rounded-[36px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.6)] border border-text-secondary/20 bg-background/95 dark:bg-[#141414]/95 backdrop-blur-xl box-border origin-top will-change-transform transition-colors duration-300 ${itemClassName}`.trim()}
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

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = '',
  itemDistance = 60,
  itemScale = 0.03,
  itemStackDistance = 25,
  stackPosition = '22%',
  scaleEndPosition = '12%',
  baseScale = 0.9,
  scaleDuration = 0.5,
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
  const lastTransformsRef = useRef(new Map<number, any>())
  const isUpdatingRef = useRef(false)

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

      const cardTop = getElementOffset(card)
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
          const jCardTop = getElementOffset(cardsRef.current[j])
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
    updateCardTransforms()
  }, [updateCardTransforms])

  const setupLenis = useCallback(() => {
    try {
      // On mobile touch devices, do not hijack touch scrolling — allow native 60/120fps kinetic scroll
      const isTouch =
        typeof window !== 'undefined' &&
        (window.matchMedia('(pointer: coarse)').matches ||
          'ontouchstart' in window ||
          window.innerWidth < 768)

      if (isTouch) {
        return null
      }

      if (useWindowScroll) {
        const lenis = new Lenis({
          duration: 1.0,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          touchMultiplier: 1.5,
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
          touchMultiplier: 1.5,
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
      card.style.willChange = 'transform, filter'
      card.style.transformOrigin = 'top center'
      card.style.backfaceVisibility = 'hidden'
      card.style.transform = 'translateZ(0)'
      card.style.webkitTransform = 'translateZ(0)'
      card.style.perspective = '1000px'
      card.style.webkitPerspective = '1000px'
    })

    setupLenis()
    updateCardTransforms()

    if (useWindowScroll) {
      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('resize', handleScroll, { passive: true })
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
        window.removeEventListener('resize', handleScroll)
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
    scaleDuration,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    setupLenis,
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
        {/* Spacer so the last pin can release cleanly */}
        <div className="scroll-stack-end w-full h-[25vh]" />
      </div>
    </div>
  )
}

export default ScrollStack
