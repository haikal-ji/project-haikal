'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function BanUserButton({
  userId,
  userName,
  isBanned,
}: {
  userId: string
  userName: string
  isBanned: boolean
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showBanForm, setShowBanForm] = useState(false)
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleUnban() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/ban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, unban: true }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error)
      } else {
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleBan() {
    if (!reason.trim()) {
      setError('Alasan ban harus diisi')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/ban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, reason }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error)
      } else {
        setShowBanForm(false)
        setReason('')
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  if (isBanned) {
    return (
      <div className="inline-flex items-center gap-2">
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button
          onClick={handleUnban}
          disabled={loading}
          className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
        >
          {loading ? '...' : '✓ Pulihkan Akun'}
        </button>
      </div>
    )
  }

  if (showBanForm) {
    return (
      <div className="space-y-2 text-right">
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={`Alasan ban ${userName}...`}
          className="w-48 text-xs rounded-lg border border-text-secondary/20 bg-background/80 px-2.5 py-1 text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-red-500 transition-colors"
          disabled={loading}
        />
        {error && <p className="text-[11px] text-red-500">{error}</p>}
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={handleBan}
            disabled={loading}
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-600 hover:bg-red-500 text-white transition-all disabled:opacity-50"
          >
            {loading ? '...' : 'Konfirmasi'}
          </button>
          <button
            onClick={() => { setShowBanForm(false); setError(null) }}
            className="px-2 py-1 rounded-full text-[11px] font-medium text-text-secondary hover:text-text-primary hover:bg-thirdary transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowBanForm(true)}
      className="px-3 py-1 rounded-full text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 transition-all"
    >
      ⊘ Ban User
    </button>
  )
}
