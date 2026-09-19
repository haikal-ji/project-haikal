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
  duration = 0.65,
  yOffset = 30,
  xOffset = 0,
  blurAmount = 12,
  className = '',
}: BlurRevealProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: yOffset,
        x: xOffset,
        filter: blurAmount > 0 ? `blur(${blurAmount}px)` : 'none',
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0,
        filter: 'blur(0px)',
      }}
      viewport={{ once: true, margin: '0px 0px -70px 0px', amount: 0.08 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      style={{
        willChange: 'transform, filter, opacity',
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
