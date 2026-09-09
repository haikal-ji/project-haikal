'use client'

import { useState } from 'react'

export default function Avatar({
  src,
  name,
  className = '',
}: {
  src: string | null
  name: string
  className?: string
}) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div className={`comment-avatar comment-avatar-fallback ${className}`}>
        {name.charAt(0).toUpperCase()}
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      className={`comment-avatar ${className}`}
      onError={() => setFailed(true)}
    />
  )
}
