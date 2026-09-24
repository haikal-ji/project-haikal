import { Suspense } from 'react'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import ArticleSearch from '@/components/ArticleSearch'
import ArtikelListSkeleton from './ArtikelListSkeleton'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ekall.vercel.app'

export const metadata: Metadata = {
  title: 'Artikel & Tulisan | Haikal',
  description: 'Catatan tentang proses, hal-hal yang sedang dipelajari, dan beberapa ide yang ingin disimpan.',
  alternates: {
    canonical: `${siteUrl}/artikel`,
  },
  openGraph: {
    title: 'Artikel & Tulisan | Haikal Journal',
    description: 'Catatan tentang proses, hal-hal yang sedang dipelajari, dan beberapa ide yang ingin disimpan.',
    url: `${siteUrl}/artikel`,
    siteName: 'Haikal Journal',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Haikal Journal — Catatan & Tulisan',
      },
      {
        url: `${siteUrl}/haikal-hero.jpg`,
        width: 800,
        height: 800,
        alt: 'Muh. Haikal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Artikel & Tulisan | Haikal Journal',
    description: 'Catatan tentang proses, hal-hal yang sedang dipelajari, dan beberapa ide yang ingin disimpan.',
    images: [`${siteUrl}/og-image.png`],
  },
}

export const dynamic = 'force-dynamic'

export default function ArtikelPage() {
  return (
    <Suspense fallback={<ArtikelListSkeleton />}>
      <ArtikelContent />
    </Suspense>
  )
}

async function ArtikelContent() {
  const articles = await prisma.article.findMany({
    orderBy: { created_at: 'asc' },
  })

  const searchableArticles = articles.map((article) => ({
    id: article.id,
    title: article.title,
    thumbnail: article.thumbnail,
    created_at: article.created_at.toISOString(),
  }))

  return (
    <main className="min-h-screen bg-background text-text-primary px-6 pt-24 sm:pt-28 pb-16 md:px-12 md:pt-32 md:pb-20 max-w-7xl mx-auto transition-colors duration-200">
      <header className="mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-text-secondary/20 bg-thirdary px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-text-secondary mb-4">
          <span>Journal / Articles</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary">
          Catatan & Tulisan
        </h1>
      </header>

      <ArticleSearch articles={searchableArticles} />
    </main>
  )
}
