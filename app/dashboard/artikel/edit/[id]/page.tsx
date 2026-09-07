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
    <div className="editor-page-shell">
      <div className="editor-page-topbar">
        <div>
          <p className="dashboard-kicker">Library / Edit entry</p>
          <h1>Edit artikel</h1>
        </div>
        <span className="editor-draft-state"><i /> Perubahan tersimpan manual</span>
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
