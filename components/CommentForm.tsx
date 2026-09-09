'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CommentForm({
  articleId,
  isLoggedIn,
}: {
  articleId: string
  isLoggedIn: boolean
}) {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isLoggedIn) {
    return (
      <Link href="/login" className="editorial-link comment-login-cta">
        Login dulu untuk berkomentar ↗
      </Link>
    )
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!content.trim()) return

    setError(null)
    setLoading(true)

    const res = await fetch('/api/comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ article_id: articleId, content }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Gagal mengirim komentar')
      return
    }

    setContent('')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Tulis komentar..."
        rows={3}
        required
        className="comment-textarea"
      />
      {error && <p className="comment-error">{error}</p>}
      <button type="submit" disabled={loading} className="editorial-link comment-submit">
        {loading ? 'Mengirim...' : 'Kirim komentar ↗'}
      </button>
    </form>
  )
}
