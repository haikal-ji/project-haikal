'use client'

import { useState } from 'react'

export default function CopyUrlButton() {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="editorial-link inline-flex items-center gap-2 text-[0.68rem]"
      style={{ borderBottom: 'none', paddingBottom: 0 }}
      aria-label="Salin link artikel"
    >
      {copied ? (
        <>
          <span style={{ fontSize: '0.9rem' }}>✓</span>
          Link tersalin!
        </>
      ) : (
        <>
          <span style={{ fontSize: '0.9rem' }}>⎘</span>
          Salin link artikel
        </>
      )}
    </button>
  )
}
