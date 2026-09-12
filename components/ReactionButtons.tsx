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
  articleTitle = 'Artikel Haikal',
}: {
  articleId: string
  initialLikeCount: number
  initialDislikeCount: number
  initialReaction: ReactionType | null
  isLoggedIn: boolean
  articleTitle?: string
}) {
  const router = useRouter()
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [dislikeCount, setDislikeCount] = useState(initialDislikeCount)
  const [reaction, setReaction] = useState<ReactionType | null>(initialReaction)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isBouncing, setIsBouncing] = useState(false)

  function requireLogin() {
    router.push(
      `/login?message=${encodeURIComponent('Kamu harus login dulu untuk memberikan apresiasi')}`
    )
  }

  async function react(type: ReactionType) {
    if (!isLoggedIn) {
      requireLogin()
      return
    }

    if (type === 'LIKE') {
      setIsBouncing(true)
      setTimeout(() => setIsBouncing(false), 500)
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

  function handleCopy() {
    if (typeof window === 'undefined') return
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleShareWhatsApp() {
    if (typeof window === 'undefined') return
    const text = encodeURIComponent(`Baca artikel menarik "${articleTitle}": ${window.location.href}`)
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank')
  }

  function handleShareTwitter() {
    if (typeof window === 'undefined') return
    const text = encodeURIComponent(`"${articleTitle}" oleh Muhammad Haikal`)
    const url = encodeURIComponent(window.location.href)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
  }

  return (
    <div className="rounded-3xl border border-text-secondary/15 bg-thirdary/30 backdrop-blur-xl p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Reaction Section */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2.5">
            Suka dengan artikel ini?
          </p>
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Love / Like Button */}
            <button
              type="button"
              disabled={loading}
              onClick={() => void react('LIKE')}
              className={`group inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border transition-all duration-300 cursor-pointer select-none active:scale-95 ${
                reaction === 'LIKE'
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-500 shadow-sm shadow-rose-500/10'
                  : 'bg-background/80 hover:bg-background border-text-secondary/20 hover:border-rose-500/40 text-text-secondary hover:text-rose-500'
              }`}
              title="Beri Apresiasi (Suka)"
            >
              <svg
                viewBox="0 0 24 24"
                className={`w-4 h-4 transition-transform duration-300 ${
                  isBouncing ? 'scale-135' : 'group-hover:scale-115'
                } ${reaction === 'LIKE' ? 'fill-current' : 'fill-none stroke-current stroke-2'}`}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span>Apresiasi</span>
              <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-text-secondary/10">
                {likeCount}
              </span>
            </button>

            {/* Subtle Feedback / Dislike Button */}
            <button
              type="button"
              disabled={loading}
              onClick={() => void react('DISLIKE')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer select-none active:scale-95 ${
                reaction === 'DISLIKE'
                  ? 'bg-text-primary text-background border-text-primary'
                  : 'bg-background/40 hover:bg-background/80 border-text-secondary/15 hover:border-text-secondary/30 text-text-secondary/70 hover:text-text-secondary'
              }`}
              title="Beri masukan jika ada yang kurang"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-current fill-none stroke-2">
                <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
              </svg>
              <span>Masukan</span>
              {dislikeCount > 0 && (
                <span className="font-mono text-[11px] opacity-80">{dislikeCount}</span>
              )}
            </button>
          </div>
        </div>

        {/* Share Section */}
        <div className="sm:text-right border-t sm:border-t-0 border-text-secondary/10 pt-3 sm:pt-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2.5">
            Bagikan Tulisan:
          </p>
          <div className="inline-flex items-center gap-2">
            {/* Copy Link */}
            <button
              type="button"
              onClick={handleCopy}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer ${
                copied
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-500'
                  : 'bg-background/80 hover:bg-background border-text-secondary/20 hover:border-text-primary text-text-secondary hover:text-text-primary'
              }`}
              title="Salin tautan artikel"
            >
              {copied ? (
                <>
                  <span>✓</span>
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-current fill-none stroke-2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  <span>Salin Link</span>
                </>
              )}
            </button>

            {/* WhatsApp */}
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="p-2 rounded-full border border-text-secondary/20 bg-background/80 hover:bg-emerald-500/10 hover:border-emerald-500/40 text-text-secondary hover:text-emerald-500 transition-all cursor-pointer"
              title="Bagikan ke WhatsApp"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.678.15-.201.3-.777.978-.953 1.179-.176.2-.351.226-.652.075-.301-.151-1.272-.469-2.423-1.496-.895-.798-1.5-1.783-1.676-2.084-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.2-.301.3-.502.101-.2.05-.376-.025-.526-.075-.151-.678-1.633-.929-2.235-.245-.587-.494-.507-.678-.517-.176-.009-.376-.01-.577-.01-.201 0-.527.075-.803.376s-1.054 1.03-1.054 2.511 1.079 2.912 1.23 3.113c.15.201 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.635.722.23 1.378.197 1.898.12.579-.086 1.78-.728 2.031-1.431.251-.703.251-1.305.176-1.431-.076-.126-.277-.201-.578-.352zM12 21.84c-1.815 0-3.593-.49-5.147-1.417l-.369-.219-3.826 1.003 1.021-3.73-.24-.382a9.78 9.78 0 0 1-1.503-5.26c0-5.422 4.412-9.835 9.837-9.835 2.628 0 5.099 1.024 6.957 2.883a9.785 9.785 0 0 1 2.88 6.952c0 5.424-4.412 9.84-9.84 9.84zm0-21.84C5.467 0 0 5.467 0 12c0 2.087.545 4.127 1.579 5.922L0 24l6.236-1.636A11.94 11.94 0 0 0 12 24c6.533 0 12-5.467 12-12S18.533 0 12 0z" />
              </svg>
            </button>

            {/* Twitter / X */}
            <button
              type="button"
              onClick={handleShareTwitter}
              className="p-2 rounded-full border border-text-secondary/20 bg-background/80 hover:bg-blue-500/10 hover:border-blue-500/40 text-text-secondary hover:text-blue-400 transition-all cursor-pointer"
              title="Bagikan ke X"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
