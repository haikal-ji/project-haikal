import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function ArtikelListPage() {
  const articles = await prisma.article.findMany({
    orderBy: { created_at: 'desc' },
  })

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="mb-8 text-3xl font-semibold">Artikel</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/artikel/${article.id}`}
            className="block overflow-hidden rounded-lg border border-gray-200"
          >
            {article.thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={article.thumbnail} alt={article.title} className="h-40 w-full object-cover" />
            ) : (
              <div className="h-40 w-full bg-gray-100" />
            )}
            <div className="p-4">
              <h2 className="mb-1 font-medium">{article.title}</h2>
              <p className="text-xs text-gray-400">
                {new Date(article.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </Link>
        ))}
        {articles.length === 0 && <p className="text-gray-400">Belum ada artikel.</p>}
      </div>
    </div>
  )
}
