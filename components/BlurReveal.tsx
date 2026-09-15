'use client'

import { motion } from 'motion/react'
import { ReactNode } from 'react'

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
  duration = 0.55,
  yOffset = 20,
  xOffset = 0,
  blurAmount = 8,
  className = '',
}: BlurRevealProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: yOffset,
        x: xOffset,
        ...(blurAmount > 0 ? { filter: `blur(${blurAmount}px)` } : {}),
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0,
        ...(blurAmount > 0 ? { filter: 'blur(0px)' } : {}),
      }}
      viewport={{ once: true, margin: '200px 0px 0px 0px', amount: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`reveal-visible ${className}`}
    >
      {children}
    </motion.div>
  )
}
