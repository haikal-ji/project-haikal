'use client'

import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import RichTextEditor from './RichTextEditor'

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
  const [thumbnail] = useState<string | null>(initialThumbnail)
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
    <form onSubmit={handleSubmit} className="editor-form">
      <div className="editor-main-column">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Judul artikel..."
          aria-label="Judul artikel"
          className="editor-title-input"
        />
        <p className="editor-helper">Tulis dengan suara kamu sendiri. Tidak perlu semuanya sempurna di awal.</p>
        <div className="editor-canvas">
          <RichTextEditor content={content} onChange={setContent} />
        </div>
      </div>

      <aside className="editor-sidebar">
        <div className="editor-panel">
          <div className="editor-panel-heading">
            <span>01</span>
            <h2>Cover image</h2>
          </div>
          <label className={`editor-cover-picker ${preview ? 'has-preview' : ''}`}>
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Preview cover artikel" />
            ) : (
              <span className="editor-cover-empty"><b>＋</b><span>Tambahkan gambar utama</span><small>JPG, PNG sampai 5MB</small></span>
            )}
            <input type="file" accept="image/*" onChange={handleThumbnailChange} />
          </label>
          <p className="editor-panel-note">Cover akan muncul di halaman jurnal dan kartu artikel.</p>
        </div>

        <div className="editor-panel editor-publish-panel">
          <div className="editor-panel-heading">
            <span>02</span>
            <h2>Publishing</h2>
          </div>
          <div className="editor-meta-row"><span>Status</span><strong><i /> Live saat disimpan</strong></div>
          <div className="editor-meta-row"><span>Format</span><strong>Article / Journal</strong></div>
          <div className="editor-action-row">
            <button type="submit" disabled={loading} className="editor-save-button">
              {loading ? 'Menyimpan...' : mode === 'create' ? 'Publikasikan artikel' : 'Simpan perubahan'}
              <span aria-hidden="true">↗</span>
            </button>
            <button type="button" className="editor-cancel-button" onClick={() => window.history.back()}>Batal</button>
          </div>
        </div>

        {error && <p className="editor-error">{error}</p>}
      </aside>
    </form>
  )
}
