'use client'

import { useState, type KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import Avatar from '@/components/Avatar'
import CommunityBadge from '@/components/CommunityBadge'

export interface CommentUserBadge {
  id: string
  badge: {
    id: string
    name: string
    emoji: string
    color: string
  }
}

export interface CommentData {
  id: string
  content: string
  created_at: string | Date
  user_id: string
  user: {
    id: string
    name: string
    avatar: string | null
    email?: string
    badges?: CommentUserBadge[]
  }
}

interface CommentItemProps {
  comment: CommentData
  isOwner: boolean
  isAuthor: boolean
  isArticleAuthor?: boolean
}

export default function CommentItem({
  comment,
  isOwner,
  isAuthor,
  isArticleAuthor = false,
}: CommentItemProps) {
  const router = useRouter()
  const [content, setContent] = useState(comment.content)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false)

  if (isDeleted) return null

  async function handleSaveEdit(e?: React.FormEvent) {
    if (e) e.preventDefault()
    if (!editContent.trim()) {
      setError('Komentar tidak boleh kosong')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/comment/${comment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Gagal menyimpan perubahan')
      } else {
        setContent(data.comment.content)
        setIsEditing(false)
        router.refresh()
      }
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
      void handleSaveEdit()
    }
  }

  async function handleDelete() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/comment/${comment.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Gagal menghapus komentar')
      } else {
        setIsDeleted(true)
        router.refresh()
      }
    } catch (err) {
      console.error(err)
      setError('Terjadi kesalahan jaringan')
    } finally {
      setLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <article className="rounded-2xl sm:rounded-3xl border border-text-secondary/15 bg-thirdary/20 hover:bg-thirdary/35 backdrop-blur-md p-4 sm:p-6 transition-all duration-300 group shadow-xs">
      <div className="flex gap-3 sm:gap-4 items-start">
        <div className="shrink-0 pt-0.5">
          <Avatar src={comment.user.avatar} name={comment.user.name} />
        </div>

        <div className="min-w-0 flex-1">
          {/* Header Bar */}
          <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-text-primary tracking-tight">
                {comment.user.name}
              </span>

              {/* Author badge if commenter is the author */}
              {isArticleAuthor && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-text-primary text-background shadow-xs">
                  <span>✍️</span>
                  <span>Penulis</span>
                </span>
              )}

              {/* Community Badges */}
              {comment.user.badges && comment.user.badges.length > 0 && (
                <div className="inline-flex items-center gap-1.5 flex-wrap">
                  {comment.user.badges.map((ub) => (
                    <CommunityBadge key={ub.id} badge={ub.badge} size="xs" />
                  ))}
                </div>
              )}
            </div>

            {/* Date & Actions */}
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <time
                dateTime={new Date(comment.created_at).toISOString()}
                className="font-mono text-[11px] text-text-secondary/80"
              >
                {new Date(comment.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </time>

              {!isEditing && (
                <div className="flex items-center gap-1">
                  {isAuthor && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(true)
                        setEditContent(content)
                        setError(null)
                        setShowDeleteConfirm(false)
                      }}
                      className="px-2 py-0.5 rounded-full text-[11px] font-medium text-text-secondary hover:text-text-primary hover:bg-thirdary border border-transparent hover:border-text-secondary/20 transition cursor-pointer"
                      title="Edit komentar saya"
                    >
                      ✏️ Edit
                    </button>
                  )}

                  {(isAuthor || isOwner) && !showDeleteConfirm && (
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-2 py-0.5 rounded-full text-[11px] font-medium text-text-secondary/70 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition cursor-pointer"
                      title={isOwner && !isAuthor ? 'Hapus komentar (Admin)' : 'Hapus komentar'}
                    >
                      {isOwner && !isAuthor ? 'Admin Hapus' : '✕ Hapus'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Delete Confirm */}
          {showDeleteConfirm && (
            <div className="my-2.5 p-3 rounded-xl border border-red-500/25 bg-red-500/10 flex items-center justify-between gap-3 text-xs animate-fade-in">
              <span className="text-red-400 font-medium">Hapus komentar ini secara permanen?</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-[11px] transition disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {loading ? '...' : 'Ya, Hapus'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={loading}
                  className="px-2.5 py-1 rounded-lg hover:bg-thirdary text-text-secondary text-[11px] transition cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 p-2 rounded-lg my-2">
              {error}
            </p>
          )}

          {/* Content / Edit Form */}
          {isEditing ? (
            <form onSubmit={handleSaveEdit} className="mt-2.5 space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={3}
                autoFocus
                disabled={loading}
                placeholder="Tulis koreksi komentarmu..."
                className="w-full rounded-xl border border-text-secondary/20 bg-background p-3 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-text-primary focus:ring-1 focus:ring-text-primary transition"
              />
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-text-secondary font-mono">
                  Ctrl + Enter untuk simpan
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false)
                      setError(null)
                    }}
                    disabled={loading}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-thirdary transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !editContent.trim()}
                    className="px-4 py-1.5 rounded-xl bg-text-primary text-background font-semibold text-xs transition hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    {loading ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed whitespace-pre-wrap break-words mt-1">
              {content}
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
