'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type ReactionType = 'LIKE' | 'DISLIKE'

export default function ReactionButtons({
  articleId,
  initialLikeCount,
  initialDislikeCount,
  initialReaction,
  isLoggedIn,
}: {
  articleId: string
  initialLikeCount: number
  initialDislikeCount: number
  initialReaction: ReactionType | null
  isLoggedIn: boolean
}) {
  const router = useRouter()
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [dislikeCount, setDislikeCount] = useState(initialDislikeCount)
  const [reaction, setReaction] = useState<ReactionType | null>(initialReaction)
  const [loading, setLoading] = useState(false)

  function requireLogin() {
    router.push(`/login?message=${encodeURIComponent('Kamu harus login dulu untuk memberikan reaksi')}`)
  }

  async function react(type: ReactionType) {
    if (!isLoggedIn) {
      requireLogin()
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/reaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article_id: articleId, type }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Gagal menyimpan reaksi')

      setLikeCount(data.likeCount)
      setDislikeCount(data.dislikeCount)
      setReaction(data.userReaction)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="reaction-buttons" aria-label="Reaksi artikel">
      <button type="button" className={`reaction-button ${reaction === 'LIKE' ? 'is-active' : ''}`} aria-pressed={reaction === 'LIKE'} disabled={loading} onClick={() => void react('LIKE')}>
        <span aria-hidden="true">👍</span> Suka <b>{likeCount}</b>
      </button>
      <button type="button" className={`reaction-button ${reaction === 'DISLIKE' ? 'is-active' : ''}`} aria-pressed={reaction === 'DISLIKE'} disabled={loading} onClick={() => void react('DISLIKE')}>
        <span aria-hidden="true">👎</span> Tidak suka <b>{dislikeCount}</b>
      </button>
    </div>
  )
}
