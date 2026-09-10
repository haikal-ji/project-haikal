'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AppealActionButtons({ appealId }: { appealId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)
  const [adminNote, setAdminNote] = useState('')
  const [showNoteInput, setShowNoteInput] = useState<'approve' | 'reject' | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleAction(action: 'APPROVED' | 'REJECTED') {
    setLoading(action === 'APPROVED' ? 'approve' : 'reject')
    setError(null)
    try {
      const res = await fetch('/api/admin/appeal', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appealId, action, adminNote }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error)
      } else {
        router.refresh()
      }
    } finally {
      setLoading(null)
      setShowNoteInput(null)
    }
  }

  if (showNoteInput) {
    return (
      <div className="space-y-2 mt-2">
        <input
          value={adminNote}
          onChange={(e) => setAdminNote(e.target.value)}
          placeholder="Catatan untuk user (opsional)..."
          className="w-full text-xs rounded-lg border border-text-secondary/20 bg-background/60 px-3 py-2 text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-text-primary transition-colors"
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAction(showNoteInput === 'approve' ? 'APPROVED' : 'REJECTED')}
            disabled={loading !== null}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-all disabled:opacity-50 ${
              showNoteInput === 'approve'
                ? 'bg-emerald-600 hover:bg-emerald-500'
                : 'bg-red-600 hover:bg-red-500'
            }`}
          >
            {loading !== null ? '...' : showNoteInput === 'approve' ? '✓ Setujui & Pulihkan' : '✕ Tolak Appeal'}
          </button>
          <button
            onClick={() => setShowNoteInput(null)}
            className="px-3 py-1.5 rounded-full text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-thirdary transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        onClick={() => setShowNoteInput('approve')}
        disabled={loading !== null}
        className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
      >
        ✓ Setujui
      </button>
      <button
        onClick={() => setShowNoteInput('reject')}
        disabled={loading !== null}
        className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
      >
        ✕ Tolak
      </button>
    </div>
  )
}
