'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useMemo, useState } from 'react'

type ArticleItem = {
  id: string
  title: string
  thumbnail: string | null
  category: string
  created_at: string
}

export default function ArticleSearch({ articles }: { articles: ArticleItem[] }) {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua')

  // Ekstrak daftar kategori unik dan hitung jumlah artikel per kategori
  const { categories, categoryCounts } = useMemo(() => {
    const counts: Record<string, number> = { Semua: articles.length }
    const catSet = new Set<string>()

    articles.forEach((article) => {
      const cat = article.category?.trim() || 'Tech'
      catSet.add(cat)
      counts[cat] = (counts[cat] || 0) + 1
    })

    return {
      categories: ['Semua', ...Array.from(catSet)],
      categoryCounts: counts,
    }
  }, [articles])

  // Filter artikel berdasarkan kata kunci (judul) DAN kategori yang dipilih
  const filteredArticles = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return articles.filter((article) => {
      const matchesQuery = !normalized || article.title.toLowerCase().includes(normalized)
      const articleCat = article.category?.trim().toLowerCase() || 'tech'
      const matchesCategory =
        selectedCategory === 'Semua' ||
        articleCat === selectedCategory.toLowerCase()

      return matchesQuery && matchesCategory
    })
  }, [articles, query, selectedCategory])

  function handleResetFilters() {
    setQuery('')
    setSelectedCategory('Semua')
  }

  return (
    <div className="space-y-8">
      {/* 1. Search Bar & Status */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 border-b border-text-secondary/15">
        <div className="relative w-full md:max-w-md">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <input
            id="article-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari artikel berdasarkan judul..."
            aria-label="Cari artikel berdasarkan judul"
            className="w-full rounded-2xl border border-text-secondary/20 bg-thirdary/60 pl-10 pr-10 py-3 text-sm text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:border-text-primary focus:bg-background transition duration-200 shadow-2xs"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Hapus kata kunci pencarian"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition p-1 rounded-full hover:bg-text-secondary/10"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex items-center justify-between md:justify-end gap-3 text-xs font-semibold text-text-secondary">
          <span>
            {filteredArticles.length} dari {articles.length} artikel
          </span>

          {(query || selectedCategory !== 'Semua') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-text-primary underline hover:text-text-secondary transition-colors"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* 2. Filter Kategori / Tags Pills */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
          Filter Kategori:
        </span>
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Filter kategori artikel">
          {categories.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.toLowerCase()
            const count = categoryCounts[cat] || 0

            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedCategory(cat)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-text-primary text-background shadow-sm scale-[1.02]'
                    : 'bg-thirdary/60 hover:bg-thirdary text-text-secondary hover:text-text-primary border border-text-secondary/15'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isActive
                      ? 'bg-background/20 text-background'
                      : 'bg-text-secondary/10 text-text-secondary'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. Grid Daftar Artikel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {filteredArticles.map((article, index) => (
          <Link
            key={article.id}
            href={`/artikel/${article.id}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-text-secondary/15 bg-thirdary/40 hover:bg-thirdary/80 transition duration-300 p-4 shadow-2xs hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="project-card-shine" />

            {/* Thumbnail */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-thirdary/40 mb-4 flex items-center justify-center">
              {article.thumbnail ? (
                <>
                  <Image
                    src={article.thumbnail}
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover blur-xl opacity-35 scale-110 select-none pointer-events-none"
                  />
                  <Image
                    src={article.thumbnail}
                    alt={article.title}
                    width={400}
                    height={250}
                    className="relative z-10 h-full w-full object-contain transition-transform duration-500 group-hover:scale-105 select-none"
                  />
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-thirdary text-text-secondary text-sm font-semibold tracking-wider uppercase">
                  Haikal Journal
                </div>
              )}

              {/* Tag Kategori Melayang di Pojok Kartu */}
              <div className="absolute top-3 left-3 z-20 bg-background/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-text-secondary/20 text-[10px] font-bold uppercase tracking-wider text-text-primary shadow-xs">
                {article.category || 'Tech'}
              </div>
            </div>

            {/* Konten Kartu */}
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
                  <span className="font-mono">#{String(index + 1).padStart(2, '0')}</span>
                  <time dateTime={article.created_at}>
                    {new Date(article.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </time>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-text-primary line-clamp-2 leading-snug group-hover:text-text-primary/90">
                  {article.title}
                </h2>
              </div>

              <div className="mt-4 pt-3 border-t border-text-secondary/10 flex items-center justify-between text-xs font-semibold text-text-secondary group-hover:text-text-primary transition-colors">
                <span>Baca artikel</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>
          </Link>
        ))}

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <div className="col-span-full py-16 px-6 text-center border border-dashed border-text-secondary/20 rounded-3xl bg-thirdary/20 space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-text-secondary/10 flex items-center justify-center text-text-secondary">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-base font-bold text-text-primary">
              Tidak ada artikel yang cocok
            </p>
            <p className="text-xs sm:text-sm text-text-secondary max-w-sm mx-auto">
              Tidak ditemukan artikel untuk kata kunci &quot;{query}&quot;
              {selectedCategory !== 'Semua' && ` di kategori "${selectedCategory}"`}.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-text-primary text-background text-xs font-bold shadow-xs hover:opacity-90 transition-opacity"
            >
              Reset Pencarian &amp; Filter
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
