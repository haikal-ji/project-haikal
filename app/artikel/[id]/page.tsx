import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import CommentForm from '@/components/CommentForm'
import CommentItem from '@/components/CommentItem'
import Avatar from '@/components/Avatar'
import type { Metadata } from 'next'
import ArticleViewTracker from '@/components/ArticleViewTracker'
import ReactionButtons from '@/components/ReactionButtons'
import { createClient } from '@/lib/supabase/server'

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
  return {
    title: `${article.title} | Haikal Journal`,
    description: article.content.replace(/<[^>]*>/g, '').slice(0, 155) + '...',
    openGraph: {
      title: article.title,
      description: article.content.replace(/<[^>]*>/g, '').slice(0, 155) + '...',
      type: 'article',
      publishedTime: new Date(article.created_at).toISOString(),
      images: article.thumbnail ? [article.thumbnail] : ['/og-image.png'],
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
          email: true,
        },
      },
      comments: {
        orderBy: { created_at: 'desc' },
        include: {
          user: {
            include: {
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

  const likeCount = article.reactions.filter((r) => r.type === 'LIKE').length
  const dislikeCount = article.reactions.filter((r) => r.type === 'DISLIKE').length
  const isOwner = Boolean(authUser?.email && authUser.email === process.env.OWNER_EMAIL)

  const currentUser = authUser?.email
    ? await prisma.user.findUnique({
        where: { email: authUser.email },
        select: { id: true, name: true, avatar: true, email: true },
      })
    : null

  const currentReaction = currentUser
    ? article.reactions.find((reaction) => reaction.user_id === currentUser.id)?.type ?? null
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
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
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
              <span>📅</span>
              <span>{formattedDate}</span>
            </span>
            <span className="opacity-30">·</span>
            <span className="inline-flex items-center gap-1.5">
              <span>⏱️</span>
              <span>~{readingTime} menit baca</span>
            </span>
            <span className="opacity-30">·</span>
            <ArticleViewTracker articleId={article.id} initialViewCount={article.view_count} />
          </div>
        </div>
      </header>

      {/* Featured Thumbnail */}
      {article.thumbnail && (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-text-secondary/15 my-10 shadow-2xl bg-thirdary/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.thumbnail}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
          />
        </div>
      )}

      {/* Article Content */}
      <div
        className="article-detail-content max-w-none text-base sm:text-lg leading-relaxed text-text-primary space-y-6 my-12"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Reactions Bar */}
      <div className="my-14">
        <ReactionButtons
          articleId={article.id}
          initialLikeCount={likeCount}
          initialDislikeCount={dislikeCount}
          initialReaction={currentReaction}
          isLoggedIn={Boolean(authUser)}
          articleTitle={article.title}
        />
      </div>

      {/* Comments Section */}
      <section className="mt-16 pt-12 border-t border-text-secondary/15">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">
              <span>💬</span>
              <span>Ruang Diskusi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary">
              Komentar Komunitas{' '}
              <span className="text-text-secondary font-normal text-xl">
                ({article.comments.length})
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Bagikan gagasan, tanggapan, atau umpan balik seputar tulisan ini.
            </p>
          </div>
        </div>

        {/* Comment Form */}
        <div className="mb-10">
          <CommentForm
            articleId={article.id}
            isLoggedIn={Boolean(authUser)}
            currentUser={currentUser}
          />
        </div>

        {/* Comments Stack */}
        {article.comments.length > 0 ? (
          <div className="space-y-4">
            {article.comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                isOwner={isOwner}
                isAuthor={comment.user_id === currentUser?.id}
                isArticleAuthor={comment.user.id === article.author_id}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-text-secondary/20 p-10 sm:p-14 text-center bg-thirdary/10">
            <div className="w-12 h-12 rounded-2xl bg-thirdary/60 border border-text-secondary/15 flex items-center justify-center text-xl mx-auto mb-3 shadow-xs">
              💭
            </div>
            <h3 className="text-base font-bold text-text-primary tracking-tight">
              Belum ada komentar
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-sm mx-auto">
              Jadilah orang pertama yang memulai percakapan dan membagikan sudut pandangmu!
            </p>
          </div>
        )}
      </section>
    </main>
  )
}
