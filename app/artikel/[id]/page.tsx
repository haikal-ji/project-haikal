import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import CommentSection from '@/components/CommentSection'
import Avatar from '@/components/Avatar'
import type { Metadata } from 'next'
import ArticleViewTracker from '@/components/ArticleViewTracker'
import ReactionButtons from '@/components/ReactionButtons'
import { createClient } from '@/lib/supabase/server'
import { sanitizeArticleHtml } from '@/lib/sanitize'

export const dynamic = 'force-dynamic'

function estimateReadingTime(html: string): number {
  // Strip HTML tags and count words
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const wordCount = text.split(' ').filter(Boolean).length
  const wordsPerMinute = 200
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const article = await prisma.article.findUnique({
    where: { id },
  })
  if (!article) return {}

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ekall.vercel.app'
  const hasThumbnail = Boolean(article.thumbnail && article.thumbnail.trim().length > 0)
  const defaultOgImage = `${siteUrl}/og-image.png`
  const defaultOwnerAvatar = `${siteUrl}/haikal-hero.jpg`

  const imageUrl = hasThumbnail
    ? (article.thumbnail!.startsWith('http') ? article.thumbnail! : `${siteUrl}${article.thumbnail}`)
    : defaultOgImage

  // Clean description stripped of HTML tags, sanitized and truncated to 155 chars
  const rawDescription = article.content
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  const description = rawDescription.length > 155
    ? rawDescription.slice(0, 152) + '...'
    : rawDescription || 'Baca artikel lengkap di Haikal Journal.'

  const ogImages = hasThumbnail
    ? [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ]
    : [
        {
          url: defaultOgImage,
          width: 1200,
          height: 630,
          alt: `${article.title} - Haikal Journal`,
        },
        {
          url: defaultOwnerAvatar,
          width: 800,
          height: 800,
          alt: 'Foto Profil Muh. Haikal',
        },
      ]

  return {
    title: `${article.title} | Haikal Journal`,
    description,
    alternates: {
      canonical: `${siteUrl}/artikel/${article.id}`,
    },
    openGraph: {
      title: article.title,
      description,
      url: `${siteUrl}/artikel/${article.id}`,
      siteName: 'Haikal Journal',
      locale: 'id_ID',
      type: 'article',
      publishedTime: new Date(article.created_at).toISOString(),
      authors: ['Muh. Haikal'],
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: [imageUrl],
    },
  }
}

export default async function ArtikelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      comments: {
        orderBy: { created_at: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
              badges: {
                include: { badge: true },
                orderBy: { awarded_at: 'asc' },
              },
            },
          },
        },
      },
      reactions: true,
    },
  })

  if (!article) notFound()

  const shareCount = article.share_count ?? 0

  let likeCount = 0
  let dislikeCount = 0

  for (const r of article.reactions) {
    if (r.type === 'DISLIKE') {
      dislikeCount++
    } else {
      likeCount++
    }
  }

  const isOwner = Boolean(authUser?.email && authUser.email === process.env.OWNER_EMAIL)

  const currentUser = authUser?.email
    ? await prisma.user.findUnique({
        where: { email: authUser.email },
        select: { id: true, name: true, avatar: true, email: true },
      })
    : null

  const rawReaction = currentUser
    ? article.reactions.find((reaction) => reaction.user_id === currentUser.id)?.type ?? null
    : null

  const currentReaction: 'LIKE' | 'DISLIKE' | null =
    rawReaction === 'DISLIKE'
      ? 'DISLIKE'
      : rawReaction === 'LIKE'
      ? 'LIKE'
      : null

  const readingTime = estimateReadingTime(article.content)
  const formattedDate = new Date(article.created_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <main className="min-h-screen bg-background text-text-primary px-6 pt-24 sm:pt-28 pb-20 md:px-10 md:pt-32 md:pb-24 max-w-4xl mx-auto transition-colors duration-200">
      {/* Back to Articles */}
      <div className="mb-8">
        <Link
          href="/artikel"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-text-secondary/20 hover:border-text-primary text-text-secondary hover:text-text-primary text-xs font-semibold uppercase tracking-wider transition-all duration-200 bg-thirdary/30 shadow-2xs hover:-translate-x-0.5 group"
        >
          <span className="transition-transform group-hover:-translate-x-0.5">←</span>
          <span>Semua Artikel</span>
        </Link>
      </div>

      {/* Editorial Header */}
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-text-secondary/20 bg-thirdary/50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-text-secondary mb-4 shadow-2xs">
          <span>Journal &amp; Insights</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-text-primary leading-[1.12]">
          {article.title}
        </h1>

        {/* Author Meta Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-text-secondary/15 py-4 my-8">
          <div className="flex items-center gap-3">
            <Avatar
              src={article.author?.avatar || null}
              name={article.author?.name || 'Muhammad Haikal'}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-text-primary">
                  {article.author?.name || 'Muhammad Haikal'}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-text-primary/10 text-text-primary border border-text-primary/20">
                  Author
                </span>
              </div>
              <p className="text-xs text-text-secondary">Software &amp; Visual Design</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-text-secondary font-medium flex-wrap">
            <span className="inline-flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formattedDate}</span>
            </span>
            <span className="opacity-30">·</span>
            <span className="inline-flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>~{readingTime} menit baca</span>
            </span>
            <span className="opacity-30">·</span>
            <ArticleViewTracker articleId={article.id} initialViewCount={article.view_count} />
            <span className="opacity-30">·</span>
            <span className="inline-flex items-center gap-1.5" title="Total artikel dibagikan">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span>{shareCount} kali dibagikan</span>
            </span>
          </div>
        </div>
      </header>

      {/* Featured Thumbnail */}
      {article.thumbnail && (
        <div className="relative max-h-[540px] aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-3xl border border-text-secondary/15 my-10 bg-thirdary/30 flex items-center justify-center">
          {/* Ambient blurred backdrop */}
          <Image
            src={article.thumbnail}
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            priority
            className="object-cover blur-2xl opacity-30 scale-110 select-none pointer-events-none"
          />
          {/* Main crisp uncropped image */}
          <Image
            src={article.thumbnail}
            alt={article.title}
            width={1200}
            height={675}
            priority
            className="relative z-10 max-h-[540px] w-full h-full object-contain transition-transform duration-700 hover:scale-[1.01] select-none"
          />
        </div>
      )}

      {/* Article Content — konten di-sanitasi untuk mencegah XSS */}
      <div
        className="article-detail-content max-w-none text-base sm:text-lg leading-relaxed text-text-primary space-y-6 my-12"
        dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(article.content) }}
      />

      {/* Reactions Bar */}
      <div className="my-14">
        <ReactionButtons
          articleId={article.id}
          initialLikeCount={likeCount}
          initialDislikeCount={dislikeCount}
          initialReaction={currentReaction}
          initialShareCount={shareCount}
          isLoggedIn={Boolean(authUser)}
          articleTitle={article.title}
        />
      </div>

      {/* Comments Section */}
      <section className="mt-16 pt-12 border-t border-text-secondary/15">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>Ruang Diskusi</span>
        </div>

        <CommentSection
          articleId={article.id}
          initialComments={article.comments}
          isOwner={isOwner}
          isLoggedIn={Boolean(authUser)}
          currentUser={currentUser}
          authorId={article.author_id}
        />
      </section>
    </main>
  )
}
