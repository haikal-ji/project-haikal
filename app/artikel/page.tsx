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
    <main className="min-h-screen bg-background text-text-primary px-6 py-16 md:px-12 md:py-20 max-w-7xl mx-auto transition-colors duration-200">
      <header className="mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-text-secondary/20 bg-thirdary px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-text-secondary mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Journal / Articles</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary">
          Catatan & Tulisan
        </h1>
        <p className="mt-3 max-w-2xl text-sm sm:text-base text-text-secondary leading-relaxed">
          Eksplorasi proses pembuatan software, best practices teknologi web modern, serta ide-ide yang ingin saya abadikan.
        </p>
      </header>

      <ArticleSearch articles={searchableArticles} />
    </main>
  )
}
