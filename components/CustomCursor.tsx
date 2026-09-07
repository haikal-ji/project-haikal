'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const target = useRef({ x: -100, y: -100 })
  const position = useRef({ x: -100, y: -100 })

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    document.documentElement.classList.add('custom-cursor-enabled')
    let frame = 0

    function move(event: PointerEvent) {
      target.current = { x: event.clientX, y: event.clientY }
    }

    function animate() {
      position.current.x += (target.current.x - position.current.x) * 0.16
      position.current.y += (target.current.y - position.current.y) * 0.16
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${position.current.x}px, ${position.current.y}px, 0)`
      }
      frame = requestAnimationFrame(animate)
    }

    window.addEventListener('pointermove', move, { passive: true })
    frame = requestAnimationFrame(animate)
    return () => {
      document.documentElement.classList.remove('custom-cursor-enabled')
      window.removeEventListener('pointermove', move)
      cancelAnimationFrame(frame)
    }
  }, [])

  return <div ref={cursorRef} className="custom-cursor" aria-hidden="true" />
}
