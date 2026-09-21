'use client'

import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import ArrowUpRight from '@/components/ui/ArrowUpRight'
import { convertHeicToJpeg } from '@/lib/image-converter'

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

  async function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    const rawFile = e.target.files?.[0]
    if (!rawFile) return
    const file = await convertHeicToJpeg(rawFile)
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
          <Image
            src={preview}
            alt="Preview avatar"
            width={80}
            height={80}
            className="profile-avatar-preview object-cover"
            unoptimized={preview.startsWith('blob:') || preview.startsWith('data:')}
          />
        ) : (
          <div className="profile-avatar-preview comment-avatar-fallback">
            {name.charAt(0).toUpperCase() || '?'}
          </div>
        )}
        <label className="profile-upload-control">
          <span>Foto profil</span>
          <strong>Ganti foto</strong>
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
        {loading ? 'Menyimpan...' : 'Simpan profil'}
      </button>
    </form>
  )
}
