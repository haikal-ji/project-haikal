'use client'

import { useState } from 'react'
import Link from 'next/link'
import CommunityBadge from '@/components/CommunityBadge'
import ArrowUpRight from '@/components/ui/ArrowUpRight'

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

type TabType = 'comments' | 'likes'

export default function PublicProfileView({ user }: { user: PublicProfileUser }) {
  const [activeTab, setActiveTab] = useState<TabType>('comments')
  const initialLetter = (user.name.trim() || 'U').charAt(0).toUpperCase()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
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

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 relative z-10">
          {/* Avatar frame */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-line shadow-md shrink-0 bg-secondary flex items-center justify-center">
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar}
                alt={user.name}
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
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border border-line bg-background text-text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
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

      {/* Activity Section */}
      <div className="mt-8">
        {/* Tab Controls */}
        <div className="flex border-b border-line gap-2 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('comments')}
            className={`pb-3 px-3 text-sm font-semibold transition-all relative cursor-pointer ${
              activeTab === 'comments'
                ? 'text-foreground'
                : 'text-text-secondary hover:text-foreground'
            }`}
          >
            <span>Komentar Publik</span>
            <span className="ml-2 px-1.5 py-0.5 text-[10px] rounded-full bg-secondary border border-line text-text-secondary">
              {user.recentComments.length}
            </span>
            {activeTab === 'comments' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('likes')}
            className={`pb-3 px-3 text-sm font-semibold transition-all relative cursor-pointer ${
              activeTab === 'likes'
                ? 'text-foreground'
                : 'text-text-secondary hover:text-foreground'
            }`}
          >
            <span>Artikel Disukai</span>
            <span className="ml-2 px-1.5 py-0.5 text-[10px] rounded-full bg-secondary border border-line text-text-secondary">
              {user.likedArticles.length}
            </span>
            {activeTab === 'likes' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
            )}
          </button>
        </div>

        {/* Tab Content: Komentar */}
        {activeTab === 'comments' && (
          <div>
            {user.recentComments.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-2xl border border-line bg-secondary/20">
                <div className="font-serif text-3xl text-text-secondary/50 mb-2">”</div>
                <p className="text-sm text-text-secondary">
                  Pengguna ini belum membagikan komentar publik.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {user.recentComments.map((c) => (
                  <article
                    key={c.id}
                    className="p-4 sm:p-5 rounded-2xl border border-line bg-secondary/20 hover:bg-secondary/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2 text-xs text-text-secondary">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-semibold uppercase tracking-wider text-[10px] text-text-secondary/70">
                          Pada artikel:
                        </span>
                        <Link
                          href={`/artikel/${c.article.id}`}
                          className="font-medium text-foreground hover:underline truncate inline-flex items-center gap-1"
                        >
                          <span>{c.article.title}</span>
                          <ArrowUpRight className="w-3 h-3 shrink-0" />
                        </Link>
                      </div>
                      <time className="shrink-0">{c.createdAt}</time>
                    </div>
                    <blockquote className="text-sm text-text-primary leading-relaxed">
                      &ldquo;{c.content}&rdquo;
                    </blockquote>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Suka */}
        {activeTab === 'likes' && (
          <div>
            {user.likedArticles.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-2xl border border-line bg-secondary/20">
                <div className="font-serif text-3xl text-text-secondary/50 mb-2">♥</div>
                <p className="text-sm text-text-secondary">
                  Pengguna ini belum memberikan apresiasi pada artikel apa pun.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {user.likedArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/artikel/${article.id}`}
                    className="p-4 rounded-2xl border border-line bg-secondary/20 hover:bg-secondary/40 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Disukai
                        </span>
                        <time>{article.createdAt}</time>
                      </div>
                      <h3 className="font-serif font-bold text-text-primary group-hover:text-foreground text-sm line-clamp-2">
                        {article.title}
                      </h3>
                    </div>
                    <div className="mt-3 text-xs font-semibold text-text-secondary group-hover:text-foreground flex items-center gap-1">
                      <span>Baca artikel</span>
                      <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
