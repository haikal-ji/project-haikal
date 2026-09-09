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
      <div className="article-search-wrap">
        <label htmlFor="article-search" className="sr-only">Cari artikel</label>
        <input
          id="article-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari artikel..."
          className="article-search"
        />
        <span className="article-search-count">{filteredArticles.length} artikel</span>
      </div>

      <div className="article-card-grid">
        {filteredArticles.map((article, index) => (
          <Link key={article.id} href={`/artikel/${article.id}`} className="article-card">
            {article.thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={article.thumbnail} alt={article.title} className="article-card-image" />
            ) : (
              <div className="article-card-image article-list-image-empty"><span>Haikal</span></div>
            )}
            <div className="article-card-copy">
              <div className="article-card-meta">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p className="article-list-date">
                {new Date(article.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
                </p>
              </div>
              <h2 className="font-serif">{article.title}</h2>
              <span className="article-list-read">Baca artikel <span aria-hidden="true">↗</span></span>
            </div>
          </Link>
        ))}
        {filteredArticles.length === 0 && <p className="articles-empty">Artikel tidak ditemukan.</p>}
      </div>
    </>
  )
}
