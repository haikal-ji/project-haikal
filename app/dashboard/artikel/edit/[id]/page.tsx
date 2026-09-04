import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ArticleForm from '@/components/ArticleForm'

export default async function EditArtikelPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const article = await prisma.article.findUnique({ where: { id } })

  if (!article) notFound()

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-2xl font-semibold">Edit Artikel</h1>
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
