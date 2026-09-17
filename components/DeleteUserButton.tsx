'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'

interface DeleteUserButtonProps {
  userId: string
  userName: string
  userEmail: string
  isOwner?: boolean
}

export default function DeleteUserButton({
  userId,
  userName,
  userEmail,
  isOwner = false,
}: DeleteUserButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (isOwner) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20">
        Owner
      </span>
    )
  }

  async function handleDelete() {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/user', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        setError(data?.error || 'Gagal menghapus user')
        setLoading(false)
        return
      }

      setIsOpen(false)
      router.refresh()
    } catch {
      setError('Terjadi kesalahan jaringan')
    } finally {
      setLoading(false)
    }
  }

  const modal = isOpen && mounted ? (
    createPortal(
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in text-left whitespace-normal font-sans"
        onClick={(e) => {
          if (e.target === e.currentTarget && !loading) {
            setIsOpen(false)
            setError(null)
          }
        }}
      >
        <div
          className="w-full max-w-md rounded-2xl border border-text-secondary/20 bg-thirdary p-6 sm:p-7 shadow-2xl space-y-4 whitespace-normal"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-red-500">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-text-primary tracking-tight">Hapus Pengguna</h3>
              <p className="text-xs text-text-secondary">Tindakan ini permanen dan tidak dapat dibatalkan</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed break-words whitespace-normal">
            Apakah kamu yakin ingin menghapus akun{' '}
            <strong className="font-semibold text-text-primary">{userName}</strong>{' '}
            <span className="text-text-secondary/70">({userEmail})</span>?
            Semua riwayat komentar, reaksi, badge, dan data terkait akun ini akan dihapus secara permanen.
          </p>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 whitespace-normal break-words">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-text-secondary/15">
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setIsOpen(false)
                setError(null)
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-background/60 border border-text-secondary/15 transition-all cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleDelete}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 text-white transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Menghapus...' : 'Ya, Hapus Akun'}
            </button>
          </div>
        </div>
      </div>,
      document.body
    )
  ) : null

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-red-400/80 hover:text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-all cursor-pointer"
        title={`Hapus akun ${userName}`}
        aria-label={`Hapus akun ${userName}`}
      >
        <svg
          className="w-3.5 h-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
        <span>Hapus</span>
      </button>

      {modal}
    </>
  )
}
