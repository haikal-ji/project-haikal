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
    <div className="flex flex-wrap items-center gap-3" aria-label="Reaksi artikel">
      <button
        type="button"
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold border transition-all duration-200 active:scale-95 cursor-pointer select-none min-h-[42px] disabled:opacity-50 disabled:cursor-wait ${
          reaction === 'LIKE'
            ? 'bg-text-primary text-background border-text-primary shadow-sm'
            : 'bg-thirdary/50 border-text-secondary/20 hover:border-text-primary/40 text-text-secondary hover:text-text-primary'
        }`}
        aria-pressed={reaction === 'LIKE'}
        disabled={loading}
        onClick={() => void react('LIKE')}
      >
        <span aria-hidden="true" className="text-base">👍</span>
        <span>Suka</span>
        <span className="font-mono text-xs px-1.5 py-0.5 rounded-full bg-text-secondary/15">
          {likeCount}
        </span>
      </button>

      <button
        type="button"
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold border transition-all duration-200 active:scale-95 cursor-pointer select-none min-h-[42px] disabled:opacity-50 disabled:cursor-wait ${
          reaction === 'DISLIKE'
            ? 'bg-text-primary text-background border-text-primary shadow-sm'
            : 'bg-thirdary/50 border-text-secondary/20 hover:border-text-primary/40 text-text-secondary hover:text-text-primary'
        }`}
        aria-pressed={reaction === 'DISLIKE'}
        disabled={loading}
        onClick={() => void react('DISLIKE')}
      >
        <span aria-hidden="true" className="text-base">👎</span>
        <span>Tidak suka</span>
        <span className="font-mono text-xs px-1.5 py-0.5 rounded-full bg-text-secondary/15">
          {dislikeCount}
        </span>
      </button>
    </div>
  )
}
