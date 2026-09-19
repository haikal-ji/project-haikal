'use client'

import { useState } from 'react'
import Image from 'next/image'

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
    <Image
      src={src}
      alt={name}
      width={48}
      height={48}
      className={`comment-avatar ${className}`}
      onError={() => setFailed(true)}
      unoptimized={src.startsWith('data:') || src.startsWith('blob:')}
    />
  )
}
