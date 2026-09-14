'use client'

import React from 'react'
import type { ReactNode } from 'react'

export interface ScrollStackItemProps {
  itemClassName?: string
  children: ReactNode
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({ children, itemClassName = '' }) => (
  <div
    className={`scroll-stack-card relative w-full min-h-[16rem] sm:min-h-[20rem] p-6 sm:p-10 md:p-12 rounded-[24px] sm:rounded-[36px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.5)] border border-text-secondary/15 dark:border-neutral-800 bg-background dark:bg-[#141414] box-border transition-colors duration-300 ${itemClassName}`.trim()}
  >
    {children}
  </div>
)

interface ScrollStackProps {
  className?: string
  children: ReactNode
  itemDistance?: number
  itemStackDistance?: number
  stackPosition?: string
  scaleEndPosition?: string
  baseScale?: number
  itemScale?: number
  useWindowScroll?: boolean
  onStackComplete?: () => void
}

export const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = '',
  itemDistance = 48,
}) => {
  const items = React.Children.toArray(children)

  return (
    <div className={`relative w-full pb-16 md:pb-24 ${className}`.trim()}>
      <div className="w-full relative flex flex-col">
        {items.map((child, idx) => (
          <div
            key={idx}
            className="sticky will-change-transform"
            style={{
              top: `${84 + idx * 24}px`,
              zIndex: idx + 1,
              marginBottom: idx < items.length - 1 ? `${itemDistance}px` : '0px',
            }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ScrollStack
