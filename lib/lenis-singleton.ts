import type Lenis from 'lenis'

let activeLenisInstance: Lenis | null = null
let resumeTimer: ReturnType<typeof setTimeout> | null = null

export function setLenisInstance(instance: Lenis | null) {
  activeLenisInstance = instance
  if (typeof window !== 'undefined') {
    ;(window as unknown as { __lenisInstance?: Lenis | null }).__lenisInstance = instance
  }
}

export function getLenisInstance(): Lenis | null {
  if (activeLenisInstance) return activeLenisInstance
  if (typeof window !== 'undefined') {
    return (window as unknown as { __lenisInstance?: Lenis | null }).__lenisInstance || null
  }
  return null
}

/**
 * Temporarily stop Lenis so native scroll can take over,
 * then automatically restart it after a delay.
 * This prevents Lenis from fighting with browser-initiated scrolling
 * (e.g. navbar anchor navigation).
 */
export function pauseLenisForNavigation(durationMs = 1200) {
  const lenis = getLenisInstance()
  if (!lenis) return

  // Clear any pending resume
  if (resumeTimer) {
    clearTimeout(resumeTimer)
    resumeTimer = null
  }

  // Stop Lenis — it will stop intercepting scroll events
  lenis.stop()

  // Restart Lenis after the scroll animation is expected to finish
  resumeTimer = setTimeout(() => {
    const current = getLenisInstance()
    if (current) {
      current.start()
    }
    resumeTimer = null
  }, durationMs)
}
