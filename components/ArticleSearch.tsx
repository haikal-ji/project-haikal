'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

type ArticleItem = {
  id: string
  title: string
  thumbnail: string | null
  created_at: string
}

export default function ArticleSearch({ articles }: { articles: ArticleItem[] }) {
  const [query, setQuery] = useState('')
  const filteredArticles = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return articles
    return articles.filter((article) => article.title.toLowerCase().includes(normalized))
  }, [articles, query])

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-text-secondary/15">
        <div className="relative w-full sm:max-w-md">
          <input
            id="article-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari artikel berdasarkan judul..."
            className="w-full rounded-xl border border-text-secondary/20 bg-thirdary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:border-text-primary transition"
          />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          {filteredArticles.length} artikel ditemukan
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article, index) => (
          <Link
            key={article.id}
            href={`/artikel/${article.id}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-text-secondary/15 bg-thirdary/40 hover:bg-thirdary/80 transition duration-300 p-4 shadow-sm"
          >
            <div className="project-card-shine" />
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-thirdary mb-4">
              {article.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-thirdary text-text-secondary text-sm font-semibold tracking-wider uppercase">
                  Haikal Journal
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
                  <span className="font-mono">#{String(index + 1).padStart(2, '0')}</span>
                  <span>
                    {new Date(article.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-text-primary group-hover:text-blue-500 transition-colors line-clamp-2 leading-snug">
                  {article.title}
                </h2>
              </div>

              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-text-secondary group-hover:text-text-primary transition-colors">
                <span>Baca selengkapnya</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>
          </Link>
        ))}
        {filteredArticles.length === 0 && (
          <div className="col-span-full py-16 text-center text-text-secondary">
            <p className="text-sm">Tidak ada artikel yang sesuai dengan kata kunci &quot;{query}&quot;.</p>
          </div>
        )}
      </div>
    </>
  )
}
