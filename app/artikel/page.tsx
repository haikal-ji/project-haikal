import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import ArticleSearch from '@/components/ArticleSearch'

export const metadata: Metadata = {
  title: 'Artikel | Haikal',
  description: 'Catatan tentang proses, hal-hal yang sedang dipelajari, dan beberapa ide yang ingin disimpan.',
}

export const dynamic = 'force-dynamic'

export default async function ArtikelListPage() {
  const articles = await prisma.article.findMany({
    orderBy: { created_at: 'desc' },
  })

  const searchableArticles = articles.map((article) => ({
    id: article.id,
    title: article.title,
    thumbnail: article.thumbnail,
    created_at: article.created_at.toISOString(),
  }))

  return (
    <main className="articles-page">
      <header className="articles-heading">
        <p className="section-index">Journal / Notes</p>
        <h1 className="font-serif">Artikel</h1>
        <p>Catatan tentang proses, hal-hal yang sedang dipelajari, dan beberapa ide yang ingin disimpan.</p>
      </header>

      <ArticleSearch articles={searchableArticles} />
    </main>
  )
}
