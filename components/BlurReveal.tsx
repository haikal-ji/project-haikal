'use client'

import { motion } from 'motion/react'
import { ReactNode, useState, useEffect } from 'react'

interface BlurRevealProps {
  children: ReactNode
  delay?: number
  duration?: number
  yOffset?: number
  xOffset?: number
  blurAmount?: number
  className?: string
}

export default function BlurReveal({
  children,
  delay = 0,
  duration = 0.6,
  yOffset = 24,
  xOffset = 0,
  blurAmount = 8,
  className = '',
}: BlurRevealProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches)
  }, [])

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: yOffset,
        x: xOffset,
        scale: isMobile ? 1 : 0.98,
        filter: isMobile ? 'none' : `blur(${blurAmount}px)`,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        filter: isMobile ? 'none' : 'blur(0px)',
      }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{
        duration: isMobile ? 0.45 : duration,
        delay: isMobile ? Math.min(delay, 0.1) : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
