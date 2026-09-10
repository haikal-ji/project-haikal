'use client'

import React, { useEffect, useMemo, useRef, type ReactNode, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollRevealProps {
  children: ReactNode
  scrollContainerRef?: RefObject<HTMLElement | null>
  enableBlur?: boolean
  baseOpacity?: number
  baseRotation?: number
  blurStrength?: number
  containerClassName?: string
  textClassName?: string
  rotationEnd?: string
  wordAnimationEnd?: string
}

export default function ScrollReveal({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'bottom bottom',
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLElement>(null)
  const text = typeof children === 'string' ? children : null

  const splitText = useMemo(() => {
    if (!text) return null
    return text.split(/(\s+)/).map((word, index) => {
      if (/^\s+$/.test(word)) return word
      return <span className="scroll-reveal-word" key={`${word}-${index}`}>{word}</span>
    })
  }, [text])

  useEffect(() => {
    const el = containerRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const scroller = scrollContainerRef?.current ?? window
    const context = gsap.context(() => {
      gsap.fromTo(el, { transformOrigin: '0% 50%', rotate: baseRotation }, {
        ease: 'none',
        rotate: 0,
        scrollTrigger: { trigger: el, scroller, start: 'top bottom', end: rotationEnd, scrub: true },
      })

      const words = el.querySelectorAll<HTMLElement>('.scroll-reveal-word')
      if (!words.length) {
        gsap.fromTo(el, { opacity: baseOpacity, filter: enableBlur ? `blur(${blurStrength}px)` : 'blur(0px)' }, {
          opacity: 1,
          filter: 'blur(0px)',
          scrollTrigger: { trigger: el, scroller, start: 'top bottom-=20%', end: wordAnimationEnd, scrub: true },
        })
        return
      }

      gsap.fromTo(words, { opacity: baseOpacity, willChange: 'opacity' }, {
        ease: 'none',
        opacity: 1,
        stagger: 0.05,
        scrollTrigger: { trigger: el, scroller, start: 'top bottom-=20%', end: wordAnimationEnd, scrub: true },
      })

      if (enableBlur) {
        gsap.fromTo(words, { filter: `blur(${blurStrength}px)` }, {
          ease: 'none',
          filter: 'blur(0px)',
          stagger: 0.05,
          scrollTrigger: { trigger: el, scroller, start: 'top bottom-=20%', end: wordAnimationEnd, scrub: true },
        })
      }
    }, el)

    return () => context.revert()
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength])

  if (!text) {
    return <div ref={containerRef as React.RefObject<HTMLDivElement>} className={`scroll-reveal ${containerClassName}`}>{children}</div>
  }

  return (
    <h2 ref={containerRef as React.RefObject<HTMLHeadingElement>} className={`scroll-reveal-heading ${containerClassName}`}>
      <span className={textClassName}>{splitText}</span>
    </h2>
  )
}
