'use client'

import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ProfileForm({
  initialName,
  initialAvatar,
}: {
  initialName: string
  initialAvatar: string | null
}) {
  const router = useRouter()
  const supabase = createClient()

  const [name, setName] = useState(initialName)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(initialAvatar)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    try {
      let avatarUrl = initialAvatar

      if (avatarFile) {
        const fileName = `avatar-${Date.now()}-${avatarFile.name}`
        const { data, error: uploadError } = await supabase.storage
          .from('thumbnails')
          .upload(fileName, avatarFile)

        if (uploadError) throw new Error(uploadError.message)

        const { data: publicUrlData } = supabase.storage.from('thumbnails').getPublicUrl(data.path)
        avatarUrl = publicUrlData.publicUrl
      }

      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, avatar: avatarUrl }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Gagal menyimpan profil')
      }

      setSuccess(true)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <div className="profile-avatar-picker">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Preview avatar" className="profile-avatar-preview" />
        ) : (
          <div className="profile-avatar-preview comment-avatar-fallback">
            {name.charAt(0).toUpperCase() || '?'}
          </div>
        )}
        <label className="profile-upload-control">
          <span>Foto profil</span>
          <strong>Ganti foto ↗</strong>
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
        </label>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-foreground/60">Nama tampilan</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="profile-name-input"
        />
      </div>

      {error && <p className="comment-error">{error}</p>}
      {success && <p className="profile-success">Profil tersimpan.</p>}

      <button type="submit" disabled={loading} className="editorial-link profile-submit">
        {loading ? 'Menyimpan...' : 'Simpan profil ↗'}
      </button>
    </form>
  )
}
