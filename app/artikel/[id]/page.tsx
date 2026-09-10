import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import CopyUrlButton from '@/components/CopyUrlButton'
import CommentForm from '@/components/CommentForm'
import Avatar from '@/components/Avatar'
import DeleteCommentButton from '@/components/DeleteCommentButton'
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
  const article = await prisma.article.findUnique({ where: { id } })
  if (!article) return {}
  return {
    title: article.title,
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
  const { data: { user: authUser } } = await supabase.auth.getUser()

  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      comments: {
        orderBy: { created_at: 'desc' },
        include: { user: true },
      },
      reactions: true,
    },
  })

  if (!article) notFound()

  const likeCount = article.reactions.filter((r) => r.type === 'LIKE').length
  const dislikeCount = article.reactions.filter((r) => r.type === 'DISLIKE').length
  const isOwner = Boolean(authUser?.email && authUser.email === process.env.OWNER_EMAIL)
  const currentUser = authUser?.email
    ? await prisma.user.findUnique({ where: { email: authUser.email }, select: { id: true } })
    : null
  const currentReaction = currentUser
    ? article.reactions.find((reaction) => reaction.user_id === currentUser.id)?.type ?? null
    : null
  const readingTime = estimateReadingTime(article.content)

  return (
    <main className="min-h-screen bg-background text-text-primary px-6 pt-24 sm:pt-28 pb-16 md:px-10 md:pt-32 md:pb-20 max-w-4xl mx-auto transition-colors duration-200">
      <Link
        href="/artikel"
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-text-primary transition mb-8"
      >
        <span>←</span> Kembali ke artikel
      </Link>

      <header className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-text-secondary/20 bg-thirdary px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-text-secondary mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span>Journal / Article</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary leading-tight">
          {article.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-text-secondary">
          <span>
            {new Date(article.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
          <span className="opacity-40">·</span>
          <span>Baca ~{readingTime} menit</span>
          <span className="opacity-40">·</span>
          <ArticleViewTracker articleId={article.id} initialViewCount={article.view_count} />
        </div>
        <div className="mt-4 flex justify-center sm:justify-start">
          <CopyUrlButton />
        </div>
      </header>

      {article.thumbnail && (
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-text-secondary/15 my-8 bg-thirdary shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.thumbnail}
            alt={article.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div
        className="article-detail-content text-base sm:text-lg leading-relaxed text-text-primary space-y-6 my-10"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <div className="border-y border-text-secondary/15 py-6 my-10">
        <ReactionButtons
          articleId={article.id}
          initialLikeCount={likeCount}
          initialDislikeCount={dislikeCount}
          initialReaction={currentReaction}
          isLoggedIn={Boolean(authUser)}
        />
      </div>

      <section className="mt-12">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary mb-6">
          Komentar <span className="text-text-secondary font-normal text-lg">({article.comments.length})</span>
        </h2>

        <div className="mb-8">
          <CommentForm articleId={article.id} isLoggedIn={Boolean(authUser)} />
        </div>

        <div className="divide-y divide-text-secondary/15">
          {article.comments.map((comment) => (
            <div key={comment.id} className="py-6 flex gap-4 items-start">
              <Avatar src={comment.user.avatar} name={comment.user.name} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-4 mb-1">
                  <p className="text-sm font-semibold text-text-primary">{comment.user.name}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-text-secondary">
                      {new Date(comment.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <DeleteCommentButton
                      commentId={comment.id}
                      isOwner={isOwner}
                      isAuthor={comment.user_id === currentUser?.id}
                    />
                  </div>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mt-1">{comment.content}</p>
              </div>
            </div>
          ))}
          {article.comments.length === 0 && (
            <div className="py-10 text-center text-text-secondary text-sm">
              Belum ada komentar. Jadilah yang pertama berkomentar!
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
