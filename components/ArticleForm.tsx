'use client'

import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import RichTextEditor from './RichTextEditor'
import ArrowUpRight from '@/components/ui/ArrowUpRight'

type ArticleFormProps = {
  mode: 'create' | 'edit'
  articleId?: string
  initialTitle?: string
  initialContent?: string
  initialThumbnail?: string | null
}

export default function ArticleForm({
  mode,
  articleId,
  initialTitle = '',
  initialContent = '',
  initialThumbnail = null,
}: ArticleFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [thumbnail, setThumbnail] = useState<string | null>(initialThumbnail)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(initialThumbnail)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleThumbnailChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setThumbnailFile(file)
    setPreview(URL.createObjectURL(file))
  }

  function handleRemoveThumbnail() {
    setThumbnail(null)
    setThumbnailFile(null)
    setPreview(null)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      let thumbnailUrl = thumbnail

      if (thumbnailFile) {
        const fileName = `thumbnail-${Date.now()}-${thumbnailFile.name}`
        const { data, error: uploadError } = await supabase.storage
          .from('thumbnails')
          .upload(fileName, thumbnailFile)

        if (uploadError) throw new Error(uploadError.message)

        const { data: publicUrlData } = supabase.storage.from('thumbnails').getPublicUrl(data.path)
        thumbnailUrl = publicUrlData.publicUrl
      }

      const url = mode === 'create' ? '/api/articles' : `/api/articles/${articleId}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, thumbnail: thumbnailUrl }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Gagal menyimpan artikel')
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left / Main Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Title Input */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Ketik judul artikel..."
            aria-label="Judul artikel"
            className="w-full text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight bg-transparent text-text-primary placeholder:text-text-secondary/40 focus:outline-none border-b border-text-secondary/20 focus:border-text-primary pb-3 sm:pb-4 transition-colors"
          />
          <p className="mt-2.5 text-xs text-text-secondary">
            Tulis dengan gaya bahasa dan perspektif personalmu. Ide sederhana seringkali jadi tulisan terbaik.
          </p>
        </div>

        {/* Rich Text Editor Card */}
        <div className="rounded-2xl border border-text-secondary/15 bg-thirdary/40 backdrop-blur-md p-4 sm:p-7 shadow-xs">
          <RichTextEditor content={content} onChange={setContent} />
        </div>
      </div>

      {/* Right / Sidebar Column */}
      <aside className="space-y-6">
        {/* Panel 1: Cover Image */}
        <div className="rounded-2xl border border-text-secondary/15 bg-thirdary/40 backdrop-blur-md p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-text-secondary">01</span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-text-primary">Cover Image</h2>
          </div>

          <label
            className={`relative flex flex-col items-center justify-center min-h-[190px] rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${
              preview
                ? 'border-transparent bg-background'
                : 'border-text-secondary/25 hover:border-text-primary/50 bg-background/50 hover:bg-background/80'
            }`}
          >
            {preview ? (
              <div className="relative w-full h-[190px] group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="Preview cover artikel"
                  className="w-full h-full object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-medium rounded-xl">
                  <span>Klik untuk ganti cover</span>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center space-y-2">
                <div className="mx-auto w-10 h-10 rounded-full bg-thirdary flex items-center justify-center text-text-secondary">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-text-primary">Unggah gambar cover</p>
                <p className="text-[11px] text-text-secondary">JPG, PNG atau WebP sampai 5MB</p>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
          </label>

          {preview && (
            <button
              type="button"
              onClick={handleRemoveThumbnail}
              className="text-xs text-red-500 hover:text-red-400 transition-colors flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Hapus cover
            </button>
          )}

          <p className="text-[11px] text-text-secondary leading-relaxed">
            Gambar cover akan ditampilkan di header artikel, kartu daftar jurnal, dan OpenGraph preview.
          </p>
        </div>

        {/* Panel 2: Publishing Actions */}
        <div className="rounded-2xl border border-text-secondary/15 bg-thirdary/40 backdrop-blur-md p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-text-secondary">02</span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-text-primary">Publikasi</h2>
          </div>

          <div className="space-y-2.5 text-xs text-text-secondary">
            <div className="flex justify-between items-center py-2 border-b border-text-secondary/10">
              <span>Status</span>
              <span className="inline-flex items-center gap-1.5 font-medium text-text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live saat disimpan
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-text-secondary/10">
              <span>Format</span>
              <span className="font-medium text-text-primary">Artikel / Jurnal</span>
            </div>
          </div>

          <div className="pt-2 space-y-2.5">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-button-hero hover:bg-button-hero-hover text-background font-semibold text-xs sm:text-sm py-3 px-6 rounded-full transition-all duration-200 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <span>Menyimpan artikel...</span>
              ) : (
                <>
                  <span>{mode === 'create' ? 'Publikasikan Artikel' : 'Simpan Perubahan'}</span>
                  <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="w-full text-center text-xs font-medium text-text-secondary hover:text-text-primary py-2 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 text-xs text-red-500 flex items-center gap-2 animate-shake">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </aside>
    </form>
  )
}
