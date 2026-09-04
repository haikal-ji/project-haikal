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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="mb-1 block text-sm font-medium">Judul</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Thumbnail</label>
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Preview thumbnail" className="mb-2 h-32 rounded-md object-cover" />
        )}
        <input type="file" accept="image/*" onChange={handleThumbnailChange} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Konten</label>
        <RichTextEditor content={content} onChange={setContent} />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-black px-6 py-2 text-white disabled:opacity-50"
      >
        {loading ? 'Menyimpan...' : mode === 'create' ? 'Simpan Artikel' : 'Update Artikel'}
      </button>
    </form>
  )
}
