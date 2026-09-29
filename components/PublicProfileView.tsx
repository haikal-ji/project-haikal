'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import CommunityBadge from '@/components/CommunityBadge'

export type PublicProfileUser = {
  id: string
  name: string
  avatar: string | null
  bio: string | null
  joinedDate: string
  isOwner: boolean
  badges: Array<{
    id: string
    name: string
    emoji: string | null
    color: string | null
  }>
  stats: {
    commentsCount: number
    likesCount: number
  }
}

export default function PublicProfileView({ user }: { user: PublicProfileUser }) {
  const [copied, setCopied] = useState(false)
  const initialLetter = (user.name.trim() || 'U').charAt(0).toUpperCase()

  function getShareUrl() {
    if (typeof window === 'undefined') return ''
    // Jika sedang di localhost, gunakan domain publik Vercel agar preview link WhatsApp dapat di-crawl
    const origin = window.location.origin.includes('localhost')
      ? 'https://ekall.vercel.app'
      : window.location.origin
    return `${origin}/pengguna/${user.id}`
  }

  function handleShareWhatsApp() {
    if (typeof window === 'undefined') return
    const shareUrl = getShareUrl()
    const text = encodeURIComponent(`Lihat profil ${user.name} di Haikal Journal`)
    const url = encodeURIComponent(shareUrl)
    window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, '_blank', 'noopener,noreferrer')
  }

  async function handleShare() {
    if (typeof window === 'undefined') return
    const shareUrl = getShareUrl()

    const shareData = {
      title: user.name,
      text: `Lihat profil ${user.name} di Haikal Journal`,
      url: shareUrl,
    }

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // User membatalkan native share sheet atau ditolak browser
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => {
          setCopied(false)
        }, 2000)
      } catch {
        // Clipboard write gagal (misal diblokir izin browser)
      }
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-14">
      {/* Tombol Kembali */}
      <div className="mb-6">
        <Link
          href="/artikel"
          className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-foreground transition-colors group"
        >
          <svg
            className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Kembali ke Artikel</span>
        </Link>
      </div>

      {/* Identity Hero Card */}
      <div className="rounded-3xl border border-line bg-secondary/30 backdrop-blur-md p-6 sm:p-10 shadow-xs relative overflow-hidden">
        {/* Subtle background glow effect */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-foreground/5 rounded-full blur-3xl pointer-events-none" />

        {/* Tombol Bagikan Profil (Pojok Kanan Atas Card) */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center gap-1.5">
          {/* Tombol WhatsApp Langsung */}
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-line bg-background/90 hover:bg-[#25D366]/10 hover:border-[#25D366]/40 text-text-secondary hover:text-[#25D366] transition-all duration-200 cursor-pointer select-none active:scale-95 shadow-xs backdrop-blur-sm"
            title="Bagikan langsung ke WhatsApp"
            aria-label="Bagikan ke WhatsApp"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </button>

          {/* Tombol Bagikan / Salin Tautan */}
          <button
            type="button"
            onClick={handleShare}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer select-none active:scale-95 shadow-xs backdrop-blur-sm ${
              copied
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 cursor-default'
                : 'border-line bg-background/90 hover:bg-foreground hover:text-background text-text-secondary hover:border-foreground'
            }`}
            title={copied ? 'Tautan profil tersalin!' : 'Bagikan profil pengguna ini'}
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5 animate-in fade-in text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Tersalin!</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>Bagikan<span className="hidden sm:inline"> Profil</span></span>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 relative z-10">
          {/* Avatar frame */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-line shadow-md shrink-0 bg-secondary flex items-center justify-center">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                width={112}
                height={112}
                priority
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-serif text-3xl font-bold text-text-primary bg-thirdary">
                {initialLetter}
              </div>
            )}
          </div>

          {/* User details */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border border-line bg-background text-text-secondary">
                {user.isOwner ? 'Official Author' : 'Community Reader'}
              </span>

              {user.badges.map((b) => (
                <CommunityBadge key={b.id} badge={b} size="xs" />
              ))}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary font-serif">
              {user.name}
            </h1>

            <p className="text-xs text-text-secondary mt-1 flex items-center justify-center sm:justify-start gap-1.5">
              <svg className="w-3.5 h-3.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Bergabung sejak {user.joinedDate}</span>
            </p>

            {/* Bio: only rendered if present */}
            {user.bio && user.bio.trim() && (
              <p className="mt-3.5 text-sm text-text-secondary italic leading-relaxed max-w-xl bg-background/50 border border-line/60 rounded-xl px-4 py-2.5">
                &ldquo;{user.bio.trim()}&rdquo;
              </p>
            )}

            {/* Stats chips */}
            <div className="flex items-center justify-center sm:justify-start gap-4 mt-5 pt-4 border-t border-line/60 text-xs text-text-secondary">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-text-primary font-serif">{user.stats.commentsCount}</span>
                <span>Komentar</span>
              </div>
              <span className="text-line">•</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-text-primary font-serif">{user.stats.likesCount}</span>
                <span>Apresiasi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
