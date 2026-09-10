'use client'

import { useEffect, useMemo, useState, type ElementType, type ReactNode } from 'react'

interface TextTypeProps extends React.HTMLAttributes<HTMLElement> {
  text: string | string[]
  as?: ElementType
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
  initialDelay?: number
  loop?: boolean
  showCursor?: boolean
  cursorCharacter?: string | ReactNode
  cursorClassName?: string
}

export default function TextType({
  text,
  as: Component = 'span',
  typingSpeed = 75,
  deletingSpeed = 50,
  pauseDuration = 1500,
  initialDelay = 0,
  loop = true,
  showCursor = true,
  cursorCharacter = '_',
  cursorClassName = '',
  className = '',
  ...props
}: TextTypeProps) {
  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text])
  const [displayedText, setDisplayedText] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentText = textArray[textIndex] ?? ''
    const isComplete = displayedText === currentText
    const isEmpty = displayedText.length === 0

    let delay = isDeleting ? deletingSpeed : typingSpeed
    if (!isDeleting && isEmpty && textIndex === 0) delay = initialDelay
    if (!isDeleting && isComplete) delay = pauseDuration
    if (isDeleting && isEmpty) delay = 250

    const timer = window.setTimeout(() => {
      if (!isDeleting) {
        if (!isComplete) {
          setDisplayedText(currentText.slice(0, displayedText.length + 1))
          return
        }

        if (textArray.length > 1 || loop) setIsDeleting(true)
        return
      }

      if (!isEmpty) {
        setDisplayedText(currentText.slice(0, displayedText.length - 1))
        return
      }

      if (!loop && textIndex === textArray.length - 1) return
      setIsDeleting(false)
      setTextIndex((currentIndex) => (currentIndex + 1) % textArray.length)
    }, Math.max(delay, 0))

    return () => window.clearTimeout(timer)
  }, [displayedText, deletingSpeed, initialDelay, isDeleting, loop, pauseDuration, textArray, textIndex, typingSpeed])

  return (
    <Component className={`inline-block ${className}`} {...props}>
      {displayedText}
      {showCursor && <span className={`text-type-cursor ${cursorClassName}`}>{cursorCharacter}</span>}
    </Component>
  )
}
