'use client'

import { useState, type ChangeEvent, type FormEvent, type DragEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type ProfileClientViewProps = {
  user: {
    id: string
    name: string
    email: string
    avatar: string | null
    createdAt: string
    isOwner: boolean
  }
  stats: {
    commentsCount: number
    likesCount: number
  }
  recentComments: Array<{
    id: string
    content: string
    createdAt: string
    article: {
      id: string
      title: string
    }
  }>
  likedArticles: Array<{
    id: string
    title: string
    createdAt: string
  }>
}

type TabType = 'identity' | 'comments' | 'likes' | 'account'

export default function ProfileClientView({
  user,
  stats,
  recentComments,
  likedArticles,
}: ProfileClientViewProps) {
  const router = useRouter()
  const supabase = createClient()

  // Form states (live preview)
  const [name, setName] = useState(user.name)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false)

  // UI states
  const [activeTab, setActiveTab] = useState<TabType>('identity')
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  // Handle file selection
  function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('Hanya file gambar yang diperbolehkan (JPG, PNG, WebP).')
      return
    }
    if (file.size > 4 * 1024 * 1024) {
      setError('Ukuran file maksimal 4MB.')
      return
    }

    setError(null)
    setAvatarFile(file)
    setIsRemovingAvatar(false)
    setAvatarPreview(URL.createObjectURL(file))
  }

  function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  function handleRemoveAvatar() {
    setAvatarFile(null)
    setAvatarPreview(null)
    setIsRemovingAvatar(true)
    setError(null)
  }

  async function handleLogout() {
    try {
      setLoggingOut(true)
      await supabase.auth.signOut()
      router.push('/')
      router.refresh()
    } catch {
      setLoggingOut(false)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    try {
      let finalAvatarUrl: string | null = user.avatar

      if (isRemovingAvatar) {
        finalAvatarUrl = null
      } else if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop() || 'jpg'
        const fileName = `avatar-${user.id}-${Date.now()}.${fileExt}`
        const { data, error: uploadError } = await supabase.storage
          .from('thumbnails')
          .upload(fileName, avatarFile)

        if (uploadError) throw new Error(uploadError.message)

        const { data: publicUrlData } = supabase.storage.from('thumbnails').getPublicUrl(data.path)
        finalAvatarUrl = publicUrlData.publicUrl
      }

      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, avatar: finalAvatarUrl }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Gagal memperbarui profil')
      }

      setSuccess(true)
      setAvatarFile(null)
      setIsRemovingAvatar(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan sistem')
    } finally {
      setLoading(false)
    }
  }

  const initialLetter = (name.trim() || user.name || 'U').charAt(0).toUpperCase()

  return (
    <div className="profile-dashboard-layout">
      {/* Kolom Kiri: Editorial Member Pass Card */}
      <aside className="profile-identity-card">
        <div className="profile-card-header">
          <span className="profile-badge-role">
            {user.isOwner ? 'Official Author' : 'Community Reader'}
          </span>
          <span className="profile-card-id">ID #{user.id.slice(0, 8)}</span>
        </div>

        <div className="profile-card-center">
          <div className="profile-avatar-frame">
            {avatarPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarPreview}
                alt={name}
                className="profile-card-avatar"
              />
            ) : (
              <div className="profile-card-avatar-fallback font-serif">
                {initialLetter}
              </div>
            )}
            <div className="profile-avatar-status-dot" title="Aktif" />
          </div>

          <h2 className="profile-card-name font-serif">{name || 'Tanpa Nama'}</h2>
          <p className="profile-card-email" title={user.email}>
            {user.email}
          </p>
          <p className="profile-card-since">Bergabung sejak {user.createdAt}</p>
        </div>

        {/* Counter Statistik */}
        <div className="profile-stats-strip">
          <div className="profile-stat-item">
            <span className="profile-stat-number font-serif">{stats.commentsCount}</span>
            <span className="profile-stat-label">Komentar</span>
          </div>
          <div className="profile-stat-divider" />
          <div className="profile-stat-item">
            <span className="profile-stat-number font-serif">{stats.likesCount}</span>
            <span className="profile-stat-label">Apresiasi</span>
          </div>
        </div>

        {/* Live Preview Komentar */}
        <div className="profile-preview-box">
          <div className="profile-preview-box-header">
            <span className="profile-kicker">Live Preview Komentar</span>
            <span className="profile-live-indicator">Realtime</span>
          </div>
          <div className="profile-comment-sample">
            <div className="sample-avatar-wrapper">
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarPreview} alt={name} className="sample-avatar" />
              ) : (
                <div className="sample-avatar sample-avatar-fallback font-serif">
                  {initialLetter}
                </div>
              )}
            </div>
            <div className="sample-content">
              <div className="sample-meta">
                <span className="sample-author">{name || 'Nama Kamu'}</span>
                <span className="sample-time">Baru saja</span>
              </div>
              <p className="sample-text">
                Identitas ini yang tampil setiap kali kamu berdiskusi di artikel.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="profile-logout-button"
        >
          {loggingOut ? 'Keluar...' : 'Keluar dari akun ↗'}
        </button>
      </aside>

      {/* Kolom Kanan: Main Tabbed Studio */}
      <section className="profile-studio-panel">
        {/* Navigation Tabs */}
        <nav className="profile-tab-nav" aria-label="Navigasi Profil">
          <button
            type="button"
            className={`profile-tab-btn ${activeTab === 'identity' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('identity')}
          >
            <span className="tab-indicator" />
            Pengaturan Profil
          </button>
          <button
            type="button"
            className={`profile-tab-btn ${activeTab === 'comments' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('comments')}
          >
            <span className="tab-indicator" />
            Komentar Saya
            <span className="tab-count-pill">{recentComments.length}</span>
          </button>
          <button
            type="button"
            className={`profile-tab-btn ${activeTab === 'likes' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('likes')}
          >
            <span className="tab-indicator" />
            Artikel Disukai
            <span className="tab-count-pill">{likedArticles.length}</span>
          </button>
          <button
            type="button"
            className={`profile-tab-btn ${activeTab === 'account' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            <span className="tab-indicator" />
            Informasi Akun
          </button>
        </nav>

        {/* Tab 1: Identitas & Personalisasi */}
        {activeTab === 'identity' && (
          <div className="profile-tab-content">
            <div className="profile-tab-header">
              <p className="profile-kicker">Identitas Publik</p>
              <h2 className="profile-tab-title font-serif">Personalisasi Karaktermu</h2>
              <p className="profile-tab-desc">
                Sesuaikan nama dan foto profil agar mudah dikenali oleh sesama pembaca dan penulis artikel.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="profile-form-grid">
              {/* Avatar Upload Dropzone */}
              <div className="profile-avatar-section">
                <label className="profile-field-label">Foto Profil</label>
                <div
                  className={`profile-dropzone ${isDragging ? 'is-dragging' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="dropzone-preview-area">
                    {avatarPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatarPreview} alt="Preview" className="dropzone-preview-img" />
                    ) : (
                      <div className="dropzone-preview-fallback font-serif">
                        {initialLetter}
                      </div>
                    )}
                  </div>
                  <div className="dropzone-info">
                    <p className="dropzone-title">Seret gambar ke sini atau klik tombol</p>
                    <p className="dropzone-sub">Mendukung format PNG, JPG, atau WebP hingga 4MB</p>
                    <div className="dropzone-actions">
                      <label className="profile-browse-btn">
                        <span>Pilih Foto Baru</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="sr-only"
                        />
                      </label>
                      {avatarPreview && (
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          className="profile-remove-avatar-btn"
                        >
                          Hapus Foto
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Name Input */}
              <div className="profile-field-group">
                <div className="profile-field-top">
                  <label htmlFor="display-name" className="profile-field-label">
                    Nama Tampilan Publik
                  </label>
                  <span className="profile-char-count">{name.length} / 50</span>
                </div>
                <input
                  id="display-name"
                  type="text"
                  value={name}
                  maxLength={50}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ketik nama kamu..."
                  required
                  className="profile-text-input"
                />
                <p className="profile-field-hint">
                  Nama ini akan menjadi nama pengirim di setiap diskusi dan komentar artikel.
                </p>
              </div>

              {/* Alerts */}
              {error && (
                <div className="profile-alert profile-alert-error">
                  <span className="alert-icon">✕</span>
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="profile-alert profile-alert-success">
                  <span className="alert-icon">✓</span>
                  <span>Profil berhasil diperbarui dan tersimpan!</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="profile-submit-wrapper">
                <button
                  type="submit"
                  disabled={loading || !name.trim()}
                  className="profile-save-btn"
                >
                  {loading ? 'Menyimpan Perubahan...' : 'Simpan Profil ↗'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Riwayat Komentar */}
        {activeTab === 'comments' && (
          <div className="profile-tab-content">
            <div className="profile-tab-header">
              <p className="profile-kicker">Riwayat Interaksi</p>
              <h2 className="profile-tab-title font-serif">Komentar yang Kamu Tulis</h2>
              <p className="profile-tab-desc">
                Daftar tanggapan dan sudut pandang yang pernah kamu bagikan di berbagai artikel.
              </p>
            </div>

            {recentComments.length === 0 ? (
              <div className="profile-empty-state">
                <div className="empty-state-glyph font-serif">”</div>
                <h3 className="empty-state-title">Belum ada komentar</h3>
                <p className="empty-state-text">
                  Kamu belum pernah berkomentar di artikel mana pun. Jelajahi tulisan terbaru dan bagikan pendapatmu!
                </p>
                <Link href="/artikel" className="empty-state-link">
                  Jelajahi Artikel ↗
                </Link>
              </div>
            ) : (
              <div className="profile-comments-feed">
                {recentComments.map((item) => (
                  <article key={item.id} className="profile-feed-card">
                    <div className="feed-card-header">
                      <span className="feed-article-label">Artikel</span>
                      <Link href={`/artikel/${item.article.id}`} className="feed-article-link font-serif">
                        {item.article.title} ↗
                      </Link>
                      <time className="feed-card-date">{item.createdAt}</time>
                    </div>
                    <blockquote className="feed-card-comment">
                      &ldquo;{item.content}&rdquo;
                    </blockquote>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Artikel Disukai */}
        {activeTab === 'likes' && (
          <div className="profile-tab-content">
            <div className="profile-tab-header">
              <p className="profile-kicker">Koleksi Apresiasi</p>
              <h2 className="profile-tab-title font-serif">Artikel yang Kamu Sukai</h2>
              <p className="profile-tab-desc">
                Daftar artikel yang telah kamu beri apresiasi dan mungkin ingin kamu baca kembali.
              </p>
            </div>

            {likedArticles.length === 0 ? (
              <div className="profile-empty-state">
                <div className="empty-state-glyph font-serif">♥</div>
                <h3 className="empty-state-title">Belum ada artikel disukai</h3>
                <p className="empty-state-text">
                  Beri reaksi suka pada artikel yang memberi inspirasi atau pengetahuan baru bagimu.
                </p>
                <Link href="/artikel" className="empty-state-link">
                  Mulai Membaca ↗
                </Link>
              </div>
            ) : (
              <div className="profile-likes-grid">
                {likedArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/artikel/${article.id}`}
                    className="profile-like-card"
                  >
                    <div className="like-card-top">
                      <span className="like-badge">Disukai</span>
                      <time className="like-date">{article.createdAt}</time>
                    </div>
                    <h3 className="like-title font-serif">{article.title}</h3>
                    <span className="like-read-more">Baca selengkapnya ↗</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Informasi Akun */}
        {activeTab === 'account' && (
          <div className="profile-tab-content">
            <div className="profile-tab-header">
              <p className="profile-kicker">Keamanan & Otentikasi</p>
              <h2 className="profile-tab-title font-serif">Rincian Akun</h2>
              <p className="profile-tab-desc">
                Informasi teknis dan kredensial akun yang terhubung dengan sesi ini.
              </p>
            </div>

            <div className="profile-account-specs">
              <div className="account-spec-row">
                <div className="spec-label">
                  <strong>Alamat Email</strong>
                  <span>Email utama untuk masuk ke website</span>
                </div>
                <div className="spec-value">
                  <span className="spec-pill">{user.email}</span>
                  <span className="spec-verified-tag">✓ Terverifikasi</span>
                </div>
              </div>

              <div className="account-spec-row">
                <div className="spec-label">
                  <strong>Status & Peran</strong>
                  <span>Hak akses dan badge identitas</span>
                </div>
                <div className="spec-value">
                  <span className="spec-pill">
                    {user.isOwner ? 'Pemilik Blog / Penulis' : 'Pembaca Komunitas'}
                  </span>
                </div>
              </div>

              <div className="account-spec-row">
                <div className="spec-label">
                  <strong>Waktu Registrasi</strong>
                  <span>Tanggal pertama kali akun dibuat</span>
                </div>
                <div className="spec-value">
                  <span>{user.createdAt}</span>
                </div>
              </div>

              <div className="account-spec-row account-danger-zone">
                <div className="spec-label">
                  <strong>Sesi & Keluar</strong>
                  <span>Akhiri sesi aktif di perangkat ini</span>
                </div>
                <div className="spec-value">
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="account-logout-btn"
                  >
                    {loggingOut ? 'Sedang keluar...' : 'Keluar dari Sesi Ini ↗'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
