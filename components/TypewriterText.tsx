'use client'

import { useEffect, useState } from 'react'

export default function TypewriterText({
  text,
  speed = 35,
  className = '',
}: {
  text: string
  speed?: number
  className?: string
}) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    setDisplayed('')
    let i = 0
    const interval = setInterval(() => {
      i += 1
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(interval)
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed])

  return (
    <span className={className}>
      {displayed}
      <span className="typewriter-cursor" aria-hidden="true">|</span>
      <span className="sr-only">{text}</span>
    </span>
  )
}
