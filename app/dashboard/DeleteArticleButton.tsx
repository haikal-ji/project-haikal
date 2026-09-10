'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteArticleButton({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    const confirmed = window.confirm('Yakin mau hapus artikel ini? Tindakan ini tidak bisa dibatalkan.')
    if (!confirmed) return

    setLoading(true)
    const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' })
    setLoading(false)

    if (res.ok) {
      router.refresh()
    } else {
      alert('Gagal menghapus artikel')
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-3 py-1 rounded-full text-xs font-medium text-red-500 hover:text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-all disabled:opacity-50"
    >
      {loading ? 'Menghapus...' : 'Hapus'}
    </button>
  )
}
