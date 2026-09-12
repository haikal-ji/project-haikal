'use client'

import { useState, type FormEvent, type KeyboardEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ArrowUpRight from '@/components/ui/ArrowUpRight'
import Avatar from '@/components/Avatar'

interface CommentFormProps {
  articleId: string
  isLoggedIn: boolean
  currentUser?: {
    name: string
    avatar: string | null
  } | null
}

export default function CommentForm({
  articleId,
  isLoggedIn,
  currentUser,
}: CommentFormProps) {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isLoggedIn) {
    return (
      <div className="rounded-3xl border border-text-secondary/15 bg-gradient-to-br from-thirdary/40 via-thirdary/20 to-transparent backdrop-blur-xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-text-primary/10 border border-text-secondary/20 flex items-center justify-center text-text-primary text-xl shrink-0 shadow-xs">
              💬
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary tracking-tight">
                Bergabung dalam Diskusi
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary mt-0.5 max-w-md">
                Punya pertanyaan, ide, atau sudut pandang berbeda? Masuk ke akunmu untuk meninggalkan komentar.
              </p>
            </div>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-text-primary hover:opacity-90 text-background text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-md shrink-0 active:scale-95 group"
          >
            <span>Masuk untuk Berkomentar</span>
            <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    )
  }

  async function handleSubmit(e?: FormEvent) {
    if (e) e.preventDefault()
    if (!content.trim()) return

    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article_id: articleId, content: content.trim() }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Gagal mengirim komentar')
        return
      }

      setContent('')
      router.refresh()
    } catch (err) {
      console.error(err)
      setError('Terjadi kesalahan jaringan')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      void handleSubmit()
    }
  }

  return (
    <div className="rounded-3xl border border-text-secondary/15 bg-thirdary/30 backdrop-blur-xl p-5 sm:p-6 shadow-sm">
      <div className="flex gap-3 sm:gap-4 items-start">
        <div className="shrink-0 hidden sm:block">
          <Avatar src={currentUser?.avatar || null} name={currentUser?.name || 'User'} />
        </div>

        <form onSubmit={handleSubmit} className="flex-1 min-w-0 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
              <span>Beri Tanggapan</span>
              {currentUser?.name && (
                <span className="text-text-secondary font-normal">sebagai {currentUser.name}</span>
              )}
            </span>
            <span className="text-[11px] text-text-secondary/60 font-mono hidden md:inline">
              Ctrl + Enter untuk kirim
            </span>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Bagikan pemikiran, sanggahan, atau ide menarikmu seputar artikel ini..."
            rows={3}
            required
            disabled={loading}
            className="w-full rounded-2xl border border-text-secondary/20 bg-background/80 hover:bg-background focus:bg-background focus:border-text-primary p-3.5 sm:p-4 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-1 focus:ring-text-primary transition-all duration-200 resize-y min-h-[100px] shadow-xs"
          />

          {error && (
            <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl flex items-center gap-1.5">
              <span>⚠️</span> {error}
            </p>
          )}

          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] text-text-secondary/60">
              {content.length > 0 ? `${content.length} karakter` : 'Dukung diskusi yang santun'}
            </span>

            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-text-primary text-background font-semibold text-xs tracking-wider uppercase transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-50 cursor-pointer shadow-xs group"
            >
              {loading ? (
                <span>Mengirim...</span>
              ) : (
                <>
                  <span>Kirim Tanggapan</span>
                  <ArrowUpRight size={11} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
