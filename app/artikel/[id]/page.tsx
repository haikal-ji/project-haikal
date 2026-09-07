import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function ArtikelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

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

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-2 text-3xl font-semibold">{article.title}</h1>
      <p className="mb-6 text-sm text-gray-400">
        {new Date(article.created_at).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </p>

      {article.thumbnail && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.thumbnail}
          alt={article.title}
          className="mb-8 w-full rounded-lg object-cover"
        />
      )}

      <div
        className="mb-8 leading-relaxed [&_img]:max-w-full [&_img]:rounded-md"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <div className="mb-10 flex gap-4 text-sm text-gray-500">
        <span>👍 {likeCount} Suka</span>
        <span>👎 {dislikeCount} Tidak Suka</span>
      </div>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Komentar ({article.comments.length})</h2>
        <div className="space-y-4">
          {article.comments.map((comment) => (
            <div key={comment.id} className="rounded-md border border-gray-200 p-3">
              <p className="mb-1 text-sm font-medium">{comment.user.name}</p>
              <p className="text-sm text-gray-600">{comment.content}</p>
            </div>
          ))}
          {article.comments.length === 0 && (
            <p className="text-sm text-gray-400">Belum ada komentar.</p>
          )}
        </div>
      </section>
    </div>
  )
}
