import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ArticleForm from '@/components/ArticleForm'

export const dynamic = 'force-dynamic'

export default async function EditArtikelPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const article = await prisma.article.findUnique({ where: { id } })

  if (!article) notFound()

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-text-secondary/15 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-text-secondary/20 bg-thirdary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span>Editor / Edit Entry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
            Edit Artikel
          </h1>
          <p className="mt-2 text-sm text-text-secondary max-w-xl">
            Perbarui isi, judul, atau cover artikel yang telah diterbitkan sebelumnya.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-text-secondary bg-thirdary/60 border border-text-secondary/15 px-3.5 py-1.5 rounded-full w-fit">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Artikel Live</span>
        </div>
      </div>

      <ArticleForm
        mode="edit"
        articleId={article.id}
        initialTitle={article.title}
        initialContent={article.content}
        initialThumbnail={article.thumbnail}
      />
    </div>
  )
}
