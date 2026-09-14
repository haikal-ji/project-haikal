'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteCommentButton({
  commentId,
  isOwner,
  isAuthor,
}: {
  commentId: string
  isOwner: boolean
  isAuthor: boolean
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  if (!isOwner && !isAuthor) return null

  async function handleDelete() {
    setLoading(true)
    try {
      const res = await fetch(`/api/comment/${commentId}`, { method: 'DELETE' })
      if (res.ok) {
        router.refresh()
      }
    } finally {
      setLoading(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <span className="comment-delete-confirm">
        <span className="comment-delete-confirm-text">Hapus komentar ini?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="comment-delete-confirm-yes"
          aria-label="Konfirmasi hapus"
        >
          {loading ? '...' : 'Ya, hapus'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="comment-delete-confirm-no"
          aria-label="Batal"
        >
          Batal
        </button>
      </span>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="comment-delete-btn"
      aria-label="Hapus komentar"
      title={isOwner && !isAuthor ? 'Hapus komentar (Admin)' : 'Hapus komentar saya'}
    >
      <span className="inline-flex items-center gap-1">
        <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <span>{isOwner && !isAuthor ? 'Admin Hapus' : 'Hapus'}</span>
      </span>
    </button>
  )
}
