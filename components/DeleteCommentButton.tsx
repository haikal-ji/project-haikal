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
      {isOwner && !isAuthor ? '✕ Admin Hapus' : '✕ Hapus'}
    </button>
  )
}
