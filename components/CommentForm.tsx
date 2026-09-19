'use client'

import { useState, type FormEvent, type KeyboardEvent } from 'react'
import Link from 'next/link'
import ArrowUpRight from '@/components/ui/ArrowUpRight'
import Avatar from '@/components/Avatar'
import { toast } from '@/components/ToastProvider'
import type { CommentData } from '@/components/CommentItem'

interface CommentFormProps {
  articleId: string
  isLoggedIn: boolean
  currentUser?: {
    id?: string
    name: string
    avatar: string | null
  } | null
  onOptimisticAdd?: (content: string) => string
  onOptimisticRollback?: (optimisticId: string) => void
  onOptimisticReplace?: (optimisticId: string, real: CommentData) => void
}

export default function CommentForm({
  articleId,
  isLoggedIn,
  currentUser,
  onOptimisticAdd,
  onOptimisticRollback,
  onOptimisticReplace,
}: CommentFormProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isLoggedIn) {
    return (
      <div className="rounded-3xl border border-text-secondary/15 bg-gradient-to-br from-thirdary/40 via-thirdary/20 to-transparent backdrop-blur-xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-text-primary/10 border border-text-secondary/20 flex items-center justify-center text-text-primary shrink-0 shadow-xs">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
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
    const trimmed = content.trim()
    if (!trimmed) return

    setError(null)
    setLoading(true)

    const optimisticId = onOptimisticAdd?.(trimmed) ?? ''
    setContent('')

    try {
      const res = await fetch('/api/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article_id: articleId, content: trimmed }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        if (optimisticId) onOptimisticRollback?.(optimisticId)
        setContent(trimmed)
        const errorMsg = data.error || 'Gagal mengirim komentar'
        setError(errorMsg)
        toast.error('Gagal mengirim komentar', errorMsg)
        return
      }

      if (optimisticId && data.comment) {
        onOptimisticReplace?.(optimisticId, data.comment)
      }
      toast.success('Komentar berhasil dikirim')
    } catch (err) {
      console.error(err)
      if (optimisticId) onOptimisticRollback?.(optimisticId)
      setContent(trimmed)
      setError('Terjadi kesalahan jaringan')
      toast.error('Koneksi terputus', 'Gagal mengirim komentar ke server.')
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
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </p>
          )}

          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] text-text-secondary/60">
              {content.length > 0 ? content.length + ' karakter' : 'Dukung diskusi yang santun'}
            </span>

            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-text-primary text-background font-semibold text-xs tracking-wider uppercase transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-50 cursor-pointer shadow-xs group"
            >
              {loading ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Mengirim...</span>
                </>
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
