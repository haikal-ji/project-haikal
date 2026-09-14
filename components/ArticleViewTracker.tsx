'use client'

import { useEffect, useRef, useState } from 'react'

export default function ArticleViewTracker({
  articleId,
  initialViewCount,
}: {
  articleId: string
  initialViewCount: number
}) {
  const [viewCount, setViewCount] = useState(initialViewCount)
  const trackedArticle = useRef<string | null>(null)

  useEffect(() => {
    if (trackedArticle.current === articleId) return
    trackedArticle.current = articleId

    void fetch(`/api/articles/${articleId}/view`, { method: 'POST' })
      .then((response) => response.ok ? response.json() : null)
      .then((data: { viewCount?: number } | null) => {
        if (typeof data?.viewCount === 'number') setViewCount(data.viewCount)
      })
  }, [articleId])

  return (
    <span className="inline-flex items-center gap-1.5">
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      <span>{viewCount} kali dibaca</span>
    </span>
  )
}
