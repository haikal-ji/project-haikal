import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ArticleForm from '@/components/ArticleForm'
import EditArtikelLoading from './loading'

export const dynamic = 'force-dynamic'

export default function EditArtikelPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <Suspense fallback={<EditArtikelLoading />}>
      <EditArtikelContent params={params} />
    </Suspense>
  )
}

async function EditArtikelContent({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [article] = await Promise.all([
    prisma.article.findUnique({ where: { id } }),
    new Promise((resolve) => setTimeout(resolve, 350)),
  ])

  if (!article) notFound()

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-text-secondary/15 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-text-secondary/20 bg-thirdary px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
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
