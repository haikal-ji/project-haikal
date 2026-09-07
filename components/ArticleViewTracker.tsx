'use client'

import { useEffect, useState } from 'react'

export default function ArticleViewTracker({
  articleId,
  initialViewCount,
}: {
  articleId: string
  initialViewCount: number
}) {
  const [viewCount, setViewCount] = useState(initialViewCount)

  useEffect(() => {
    void fetch(`/api/articles/${articleId}/view`, { method: 'POST' })
      .then((response) => response.ok ? response.json() : null)
      .then((data: { viewCount?: number } | null) => {
        if (typeof data?.viewCount === 'number') setViewCount(data.viewCount)
      })
  }, [articleId])

  return <span>👁 {viewCount} kali dibaca</span>
}
