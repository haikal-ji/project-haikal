import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import CopyUrlButton from '@/components/CopyUrlButton'
import CommentForm from '@/components/CommentForm'
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
  const currentUser = authUser?.email
    ? await prisma.user.findUnique({ where: { email: authUser.email }, select: { id: true } })
    : null
  const currentReaction = currentUser
    ? article.reactions.find((reaction) => reaction.user_id === currentUser.id)?.type ?? null
    : null
  const readingTime = estimateReadingTime(article.content)

  return (
    <main className="article-detail-page">
      <Link href="/artikel" className="editorial-link article-back">← Kembali ke artikel</Link>
      <header className="article-detail-heading">
        <p className="section-index">Journal / Article</p>
        <h1 className="font-serif">{article.title}</h1>
      <p className="article-detail-date">
          {new Date(article.created_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
          <span className="mx-2 opacity-40">·</span>
          Baca ~{readingTime} menit
          <span className="mx-2 opacity-40">·</span>
          <ArticleViewTracker articleId={article.id} initialViewCount={article.view_count} />
        </p>
        <div className="mt-4 flex justify-center">
          <CopyUrlButton />
        </div>
      </header>

      {article.thumbnail && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.thumbnail}
          alt={article.title}
          className="article-detail-cover"
        />
      )}

      <div
        className="article-detail-content"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <div className="article-reactions">
        <ReactionButtons
          articleId={article.id}
          initialLikeCount={likeCount}
          initialDislikeCount={dislikeCount}
          initialReaction={currentReaction}
          isLoggedIn={Boolean(authUser)}
        />
      </div>

      <section className="article-comments">
        <h2 className="font-serif">Komentar <span>({article.comments.length})</span></h2>

        <div className="comment-form-wrapper">
          <CommentForm articleId={article.id} isLoggedIn={Boolean(authUser)} />
        </div>

        <div>
          {article.comments.map((comment) => (
            <div key={comment.id} className="article-comment">
              <Avatar src={comment.user.avatar} name={comment.user.name} />
              <div className="comment-body">
                <div className="comment-meta">
                  <p className="comment-author">{comment.user.name}</p>
                  <span className="comment-date">
                    {new Date(comment.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <span className="comment-content">{comment.content}</span>
              </div>
            </div>
          ))}
          {article.comments.length === 0 && (
            <p className="article-no-comments">Belum ada komentar. Jadilah yang pertama!</p>
          )}
        </div>
      </section>
    </main>
  )
}
