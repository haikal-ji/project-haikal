'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ArrowUpRight from '@/components/ui/ArrowUpRight'

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
      <Link
        href="/login"
        className="flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-text-secondary/20 bg-thirdary/40 hover:bg-thirdary/70 transition-all duration-200 group shadow-xs"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-text-secondary/15 flex items-center justify-center text-text-primary text-base group-hover:scale-105 transition-transform shrink-0">
            💬
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">Ingin ikut berdiskusi?</p>
            <p className="text-xs text-text-secondary">Masuk ke akunmu untuk meninggalkan komentar</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-text-primary text-background text-xs font-bold uppercase tracking-wider group-hover:opacity-90 transition-opacity shrink-0">
          <span>Login</span>
          <ArrowUpRight size={11} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </span>
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
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Tulis tanggapan atau pemikiranmu..."
        rows={3}
        required
        className="w-full rounded-2xl border border-text-secondary/20 bg-thirdary/30 hover:bg-thirdary/50 focus:bg-background focus:border-text-primary p-4 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none transition-all duration-200 resize-y min-h-[96px] shadow-xs"
      />
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1.5">
          <span>⚠️</span> {error}
        </p>
      )}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-text-primary text-background font-semibold text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <span>Mengirim...</span>
          ) : (
            <>
              <span>Kirim komentar</span>
              <ArrowUpRight size={11} />
            </>
          )}
        </button>
      </div>
    </form>
  )
}
