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
  duration = 0.7,
  yOffset = 35,
  xOffset = 0,
  blurAmount = 10,
  className = '',
}: BlurRevealProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: yOffset,
        x: xOffset,
        scale: 0.97,
        filter: `blur(${blurAmount}px)`,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        filter: 'blur(0px)',
      }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
