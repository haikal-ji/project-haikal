'use client'

import { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import ArrowUpRight from '@/components/ui/ArrowUpRight'
import CommunityBadge from '@/components/CommunityBadge'
import { toast } from '@/components/ToastProvider'

type ProfileClientViewProps = {
  user: {
    id: string
    name: string
    email: string
    avatar: string | null
    bio?: string | null
    createdAt: string
    isOwner: boolean
    badges?: Array<{
      id: string
      badge_id: string
      badge: {
        id: string
        name: string
        emoji: string | null
        color: string | null
      }
    }>
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

type BanStatus = {
  is_banned: boolean
  ban_reason: string | null
  active_appeal: { id: string; reason: string; created_at: string } | null
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
  const [bio, setBio] = useState(user.bio || '')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar)

  // Direct Instagram-style Avatar Picker states
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)

  // UI & tab states
  const [activeTab, setActiveTab] = useState<TabType>('identity')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  // Activity list & pagination states
  const [commentsList, setCommentsList] = useState(recentComments)
  const [hasMoreComments, setHasMoreComments] = useState(stats.commentsCount > recentComments.length)
  const [loadingComments, setLoadingComments] = useState(false)

  const [likesList, setLikesList] = useState(likedArticles)
  const [hasMoreLikes, setHasMoreLikes] = useState(stats.likesCount > likedArticles.length)
  const [loadingLikes, setLoadingLikes] = useState(false)

  // Direct Instagram-style upload & save function
  async function uploadAndSaveAvatar(file: File) {
    if (!file.type.startsWith('image/')) {
      toast.error('Hanya file gambar yang diperbolehkan (JPG, PNG, WebP).')
      return
    }
    if (file.size > 4 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 4MB.')
      return
    }

    // Optimistic preview instan
    const localPreview = URL.createObjectURL(file)
    setAvatarPreview(localPreview)
    setAvatarUploading(true)
    setShowAvatarModal(false)

    try {
      const fileExt = file.name.split('.').pop() || 'jpg'
      const fileName = `avatar-${user.id}-${Date.now()}.${fileExt}`

      const uploadRes = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true })

      if (uploadRes.error) {
        throw new Error(
          `Gagal upload foto profil ke bucket 'avatars'. Pastikan bucket 'avatars' sudah dikonfigurasi dengan benar di Supabase Storage. Detail: ${uploadRes.error.message}`
        )
      }

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(uploadRes.data?.path || fileName)

      const finalAvatarUrl = publicUrlData.publicUrl

      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), avatar: finalAvatarUrl, bio: bio.trim() }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Gagal memperbarui foto profil')
      }

      setAvatarPreview(finalAvatarUrl)
      toast.success('Foto profil berhasil diubah!')
      router.refresh()
    } catch (err: unknown) {
      setAvatarPreview(user.avatar)
      const msg = err instanceof Error ? err.message : 'Gagal memperbarui foto profil'
      toast.error(msg)
    } finally {
      setAvatarUploading(false)
    }
  }

  // Hapus foto profil langsung
  async function removeAndSaveAvatar() {
    setAvatarUploading(true)
    setShowAvatarModal(false)

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), avatar: null, bio: bio.trim() }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Gagal menghapus foto profil')
      }

      setAvatarPreview(null)
      toast.success('Foto profil berhasil dihapus!')
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menghapus foto profil'
      toast.error(msg)
    } finally {
      setAvatarUploading(false)
    }
  }

  function handleAvatarCircleClick() {
    if (avatarUploading) return
    if (avatarPreview) {
      setShowAvatarModal(true)
    } else {
      fileInputRef.current?.click()
    }
  }

  async function handleDirectFileInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      await uploadAndSaveAvatar(file)
    }
    e.target.value = ''
  }

  // Load more comments
  async function loadMoreComments() {
    if (loadingComments || !hasMoreComments) return
    setLoadingComments(true)
    try {
      const res = await fetch(`/api/profile/activity?type=comments&skip=${commentsList.length}&take=10`)
      if (!res.ok) throw new Error('Gagal memuat riwayat komentar')
      const data = await res.json()
      setCommentsList((prev) => [...prev, ...data.items])
      setHasMoreComments(data.hasMore)
    } catch {
      toast.error('Gagal memuat riwayat komentar tambahan')
    } finally {
      setLoadingComments(false)
    }
  }

  // Load more likes
  async function loadMoreLikes() {
    if (loadingLikes || !hasMoreLikes) return
    setLoadingLikes(true)
    try {
      const res = await fetch(`/api/profile/activity?type=likes&skip=${likesList.length}&take=10`)
      if (!res.ok) throw new Error('Gagal memuat artikel disukai')
      const data = await res.json()
      setLikesList((prev) => [...prev, ...data.items])
      setHasMoreLikes(data.hasMore)
    } catch {
      toast.error('Gagal memuat artikel disukai tambahan')
    } finally {
      setLoadingLikes(false)
    }
  }

  // Ban status & appeal form
  const [banStatus, setBanStatus] = useState<BanStatus | null>(null)
  const [appealReason, setAppealReason] = useState('')
  const [appealLoading, setAppealLoading] = useState(false)
  const [appealError, setAppealError] = useState<string | null>(null)
  const [appealSuccess, setAppealSuccess] = useState(false)

  useEffect(() => {
    fetch('/api/profile/ban-status')
      .then((r) => r.json())
      .then((data) => setBanStatus(data))
      .catch(() => {})
  }, [])

  async function handleLogout() {
    try {
      setLoggingOut(true)
      await supabase.auth.signOut()
      await fetch('/auth/signout', {
        method: 'POST',
        headers: { Accept: 'application/json' },
      })
    } catch {
      // Abaikan jika error jaringan
    } finally {
      window.location.href = '/login'
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), bio: bio.trim() }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Gagal memperbarui profil')
      }

      setSuccess(true)
      toast.success('Profil diperbarui!', 'Perubahan nama dan bio berhasil disimpan ke akunmu.')
      router.refresh()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem'
      setError(msg)
      toast.error('Gagal memperbarui profil', msg)
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
          {/* Hidden File Input untuk Direct Upload Instagram Style */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleDirectFileInputChange}
            className="sr-only"
            aria-hidden="true"
          />

          <div
            className="profile-avatar-frame group cursor-pointer select-none"
            onClick={handleAvatarCircleClick}
            title={avatarPreview ? 'Klik untuk mengubah atau menghapus foto profil' : 'Klik untuk memilih foto profil'}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleAvatarCircleClick()
              }
            }}
          >
            {/* Foto Profil Utama */}
            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-line group-hover:border-foreground/40 transition-all duration-300 shadow-md group-hover:shadow-xl">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt={name}
                  width={112}
                  height={112}
                  priority
                  className="profile-card-avatar !border-0 group-hover:scale-105 transition-transform duration-300 object-cover w-full h-full"
                  unoptimized={avatarPreview.startsWith('blob:') || avatarPreview.startsWith('data:')}
                />
              ) : (
                <div className="profile-card-avatar-fallback !border-0 font-serif group-hover:scale-105 transition-transform duration-300">
                  {initialLetter}
                </div>
              )}

              {/* Instagram-style Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-200 backdrop-blur-[2px]">
                <svg className="w-6 h-6 mb-1 drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-[10px] font-semibold tracking-wider uppercase drop-shadow">Ubah Foto</span>
              </div>

              {/* Loading Spinner saat proses upload */}
              {avatarUploading && (
                <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-white z-20 backdrop-blur-sm">
                  <svg className="w-6 h-6 animate-spin text-emerald-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-[9px] font-medium mt-1">Menyimpan...</span>
                </div>
              )}
            </div>

            {/* Camera Badge Khas Instagram di kanan bawah */}
            <div
              className="absolute bottom-1 right-1 h-7.5 w-7.5 rounded-full bg-foreground text-background shadow-md border-2 border-background flex items-center justify-center group-hover:scale-110 transition-transform duration-200 z-10"
              title="Ganti foto profil"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 9a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z" />
                <path fillRule="evenodd" clipRule="evenodd" d="M9.344 3.071a1.5 1.5 0 011.06-.442h3.192c.398 0 .78.159 1.06.442l1.107 1.108a.75.75 0 00.53.221H19A2.25 2.25 0 0121.25 6.65v11.7A2.25 2.25 0 0119 20.6H5A2.25 2.25 0 012.75 18.35V6.65A2.25 2.25 0 015 4.4h2.707a.75.75 0 00.53-.221L9.344 3.07zM12 7.5a5.25 5.25 0 100 10.5 5.25 5.25 0 000-10.5z" />
              </svg>
            </div>
          </div>

          <h2 className="profile-card-name font-serif">{name || 'Tanpa Nama'}</h2>

          {/* Badges Pengguna */}
          {user.badges && user.badges.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2 mb-1.5 max-w-full px-2">
              {user.badges.map((b) => (
                <CommunityBadge key={b.id} badge={b.badge} size="xs" />
              ))}
            </div>
          )}

          {/* Bio Singkat */}
          {bio.trim() && (
            <div className="mt-3 flex justify-center w-full">
              <p className="mx-auto px-3.5 py-2 text-xs text-text-secondary italic text-center bg-secondary/40 border border-line/60 rounded-xl max-w-xs break-words leading-relaxed">
                &ldquo;{bio.trim()}&rdquo;
              </p>
            </div>
          )}

          {/* Tautan ke Profil Publik */}
          <div className="mt-3.5 flex justify-center">
            <Link
              href={`/pengguna/${user.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-foreground transition-colors underline decoration-dotted underline-offset-4 group"
            >
              <span>Lihat Profil Publik</span>
              <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
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
            <span className="tab-count-pill">{stats.commentsCount}</span>
          </button>
          <button
            type="button"
            className={`profile-tab-btn ${activeTab === 'likes' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('likes')}
          >
            <span className="tab-indicator" />
            Artikel Disukai
            <span className="tab-count-pill">{stats.likesCount}</span>
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
              <h2 className="profile-tab-title">Personalisasi Karaktermu</h2>
            </div>

            <form onSubmit={handleSubmit} className="profile-form-grid">
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
              </div>

              {/* Bio Singkat Input */}
              <div className="profile-field-group">
                <div className="profile-field-top">
                  <label htmlFor="user-bio" className="profile-field-label">
                    Bio Singkat
                  </label>
                  <span className="profile-char-count">{bio.length} / 160</span>
                </div>
                <textarea
                  id="user-bio"
                  value={bio}
                  maxLength={160}
                  rows={3}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tuliskan sedikit tentang dirimu, minat baca, atau topik yang kamu sukai..."
                  className="profile-text-input resize-none"
                />
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
                  {loading ? 'Menyimpan Perubahan...' : 'Simpan Profil'}
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
              <h2 className="profile-tab-title">Komentar yang Kamu Tulis</h2>
            </div>

            {commentsList.length === 0 ? (
              <div className="profile-empty-state">
                <div className="empty-state-glyph font-serif">”</div>
                <h3 className="empty-state-title">Belum ada komentar</h3>
                <p className="empty-state-text">
                  Kamu belum pernah berkomentar di artikel mana pun. Jelajahi tulisan terbaru dan bagikan pendapatmu!
                </p>
                <Link href="/artikel" className="empty-state-link">
                  Jelajahi Artikel
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="profile-comments-feed">
                  {commentsList.map((item) => (
                    <article key={item.id} className="profile-feed-card">
                      <div className="feed-card-header">
                        <span className="feed-article-label">Artikel</span>
                        <Link href={`/artikel/${item.article.id}`} className="feed-article-link">
                          {item.article.title}
                        </Link>
                        <time className="feed-card-date">{item.createdAt}</time>
                      </div>
                      <blockquote className="feed-card-comment">
                        &ldquo;{item.content}&rdquo;
                      </blockquote>
                    </article>
                  ))}
                </div>

                {hasMoreComments && (
                  <div className="pt-4 flex justify-center">
                    <button
                      type="button"
                      onClick={loadMoreComments}
                      disabled={loadingComments}
                      className="px-5 py-2.5 rounded-full border border-line bg-secondary hover:bg-line/40 text-xs font-semibold text-text-primary transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loadingComments ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-text-primary border-t-transparent rounded-full animate-spin" />
                          <span>Memuat riwayat...</span>
                        </>
                      ) : (
                        <span>Muat lebih banyak komentar</span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Artikel Disukai */}
        {activeTab === 'likes' && (
          <div className="profile-tab-content">
            <div className="profile-tab-header">
              <p className="profile-kicker">Koleksi Apresiasi</p>
              <h2 className="profile-tab-title">Artikel yang Kamu Sukai</h2>
            </div>

            {likesList.length === 0 ? (
              <div className="profile-empty-state">
                <div className="empty-state-glyph font-serif">♥</div>
                <h3 className="empty-state-title">Belum ada artikel disukai</h3>
                <p className="empty-state-text">
                  Beri reaksi suka pada artikel yang memberi inspirasi atau pengetahuan baru bagimu.
                </p>
                <Link href="/artikel" className="empty-state-link">
                  Mulai Membaca
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="profile-likes-grid">
                  {likesList.map((article) => (
                    <Link
                      key={article.id}
                      href={`/artikel/${article.id}`}
                      className="profile-like-card"
                    >
                      <div className="like-card-top">
                        <span className="like-badge">Disukai</span>
                        <time className="like-date">{article.createdAt}</time>
                      </div>
                      <h3 className="like-title">{article.title}</h3>
                      <span className="like-read-more">Baca selengkapnya</span>
                    </Link>
                  ))}
                </div>

                {hasMoreLikes && (
                  <div className="pt-4 flex justify-center">
                    <button
                      type="button"
                      onClick={loadMoreLikes}
                      disabled={loadingLikes}
                      className="px-5 py-2.5 rounded-full border border-line bg-secondary hover:bg-line/40 text-xs font-semibold text-text-primary transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loadingLikes ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-text-primary border-t-transparent rounded-full animate-spin" />
                          <span>Memuat artikel...</span>
                        </>
                      ) : (
                        <span>Muat lebih banyak artikel disukai</span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Informasi Akun */}
        {activeTab === 'account' && (
          <div className="profile-tab-content">
            <div className="profile-tab-header">
              <p className="profile-kicker">Keamanan & Otentikasi</p>
              <h2 className="profile-tab-title">Rincian Akun</h2>
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

              {/* Ban Status Section */}
              {banStatus?.is_banned && (
                <div className="account-ban-section">
                  <div className="account-ban-banner">
                    <div className="account-ban-icon">⊘</div>
                    <div>
                      <strong className="account-ban-title">Akun kamu telah dinonaktifkan</strong>
                      {banStatus.ban_reason && (
                        <p className="account-ban-reason">Alasan: {banStatus.ban_reason}</p>
                      )}
                    </div>
                  </div>

                  {banStatus.active_appeal ? (
                    <div className="account-appeal-pending">
                      <span className="account-appeal-pending-icon flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                      <div>
                        <strong>Permohonan sedang ditinjau</strong>
                        <p>Admin akan memproses permohonanmu. Harap bersabar.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="account-appeal-form">
                      <p className="account-appeal-intro">
                        Kamu dapat mengajukan permohonan pemulihan akun. Jelaskan alasanmu dengan jujur dan admin akan meninjaunya.
                      </p>
                      {appealSuccess ? (
                        <div className="account-appeal-success">
                          ✓ Permohonan berhasil dikirim. Tunggu tinjauan dari admin.
                        </div>
                      ) : (
                        <>
                          <textarea
                            value={appealReason}
                            onChange={(e) => setAppealReason(e.target.value)}
                            placeholder="Jelaskan mengapa akunmu seharusnya dipulihkan... (minimal 20 karakter)"
                            className="account-appeal-textarea"
                            rows={4}
                            disabled={appealLoading}
                          />
                          {appealError && <p className="appeal-error-msg">{appealError}</p>}
                          <button
                            type="button"
                            disabled={appealLoading || appealReason.trim().length < 20}
                            className="account-appeal-submit"
                            onClick={async () => {
                              setAppealLoading(true)
                              setAppealError(null)
                              try {
                                const res = await fetch('/api/admin/appeal', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ reason: appealReason }),
                                })
                                const data = await res.json()
                                if (!res.ok) {
                                  setAppealError(data.error)
                                } else {
                                  setAppealSuccess(true)
                                  setBanStatus((prev) => prev ? { ...prev, active_appeal: data.appeal } : prev)
                                }
                              } finally {
                                setAppealLoading(false)
                              }
                            }}
                          >
                            {appealLoading ? 'Mengirim...' : 'Kirim Permohonan Unban'}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

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
                    {loggingOut ? 'Sedang keluar...' : 'Keluar dari Sesi Ini'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Modal Aksi Foto Profil Khas Instagram */}
      {showAvatarModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowAvatarModal(false)}
        >
          <div
            className="w-full max-w-sm overflow-hidden rounded-2xl bg-white dark:bg-[#1c1c1e] text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-800 shadow-2xl text-center animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">Ubah Foto Profil</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Pilih tindakan untuk memperbarui foto akun kamu
              </p>
            </div>

            <div className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-800">
              <button
                type="button"
                onClick={() => {
                  setShowAvatarModal(false)
                  fileInputRef.current?.click()
                }}
                className="w-full py-3.5 text-sm font-bold text-[#0095F6] hover:bg-neutral-50 dark:hover:bg-white/5 transition cursor-pointer active:scale-98"
              >
                Unggah Foto Baru
              </button>

              {avatarPreview && (
                <button
                  type="button"
                  onClick={removeAndSaveAvatar}
                  className="w-full py-3.5 text-sm font-bold text-[#ED4956] hover:bg-neutral-50 dark:hover:bg-white/5 transition cursor-pointer active:scale-98"
                >
                  Hapus Foto Saat Ini
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="w-full py-3.5 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/5 transition cursor-pointer active:scale-98"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
