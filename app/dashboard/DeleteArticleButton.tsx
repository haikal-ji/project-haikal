'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from '@/components/ToastProvider'

export default function DeleteArticleButton({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)

  async function handleConfirmDelete() {
    setLoading(true)
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Artikel telah dihapus')
        setIsConfirming(false)
        router.refresh()
      } else {
        toast.error('Gagal menghapus artikel')
      }
    } catch {
      toast.error('Koneksi terputus')
    } finally {
      setLoading(false)
    }
  }

  if (isConfirming) {
    return (
      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs animate-in fade-in duration-150">
        <span className="text-rose-400 font-medium text-[11px]">Hapus?</span>
        <button
          type="button"
          onClick={handleConfirmDelete}
          disabled={loading}
          className="font-semibold text-rose-400 hover:text-rose-300 text-[11px] px-1 hover:underline disabled:opacity-50"
        >
          {loading ? 'Menghapus...' : 'Ya'}
        </button>
        <span className="text-text-secondary/40 text-[10px]">|</span>
        <button
          type="button"
          onClick={() => setIsConfirming(false)}
          disabled={loading}
          className="text-text-secondary hover:text-text-primary text-[11px] px-1 hover:underline"
        >
          Batal
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setIsConfirming(true)}
      className="px-3 py-1 rounded-full text-xs font-medium text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-all"
    >
      Hapus
    </button>
  )
}
