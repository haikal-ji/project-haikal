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

  async function handleShare() {
    if (typeof window === 'undefined') return

    const shareData = {
      title: user.name,
      text: `Lihat profil ${user.name} di Haikal Journal`,
      url: window.location.href,
    }

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // User membatalkan native share sheet atau ditolak browser
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.href)
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

        {/* Tombol Bagikan Profil (Pojok Kanan Atas Card agar tidak menumpuk di mobile) */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
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
