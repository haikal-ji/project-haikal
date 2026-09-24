export default function ArtikelLoading() {
  return (
    <main className="min-h-screen bg-background text-text-primary px-6 pt-24 sm:pt-28 pb-16 md:px-12 md:pt-32 md:pb-20 max-w-7xl mx-auto transition-colors duration-200 animate-pulse">
      {/* Header Skeleton */}
      <header className="mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-text-secondary/20 bg-thirdary px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-text-secondary mb-4">
          <span>Journal / Articles</span>
        </div>
        <div className="h-10 sm:h-12 w-60 sm:w-80 rounded-2xl bg-thirdary/80" />
      </header>

      {/* Search Bar Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-text-secondary/15">
        <div className="w-full sm:max-w-md h-10 rounded-xl bg-thirdary/60 border border-text-secondary/20" />
        <div className="w-32 h-4 rounded bg-thirdary/50" />
      </div>

      {/* Article Cards Grid Skeleton (3 columns matching ArticleSearch) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-2xl border border-text-secondary/15 bg-thirdary/40 p-4 shadow-xs space-y-3"
          >
            {/* Thumbnail skeleton (16:10 aspect ratio) */}
            <div className="aspect-[16/10] w-full rounded-xl bg-thirdary/60 border border-text-secondary/10" />

            {/* Date / meta skeleton */}
            <div className="flex items-center justify-between text-xs mb-2">
              <div className="w-8 h-3.5 rounded bg-thirdary/70" />
              <div className="w-24 h-3.5 rounded bg-thirdary/60" />
            </div>

            {/* Title skeleton */}
            <div className="space-y-2 pt-1">
              <div className="w-full h-5 rounded-lg bg-thirdary/80" />
              <div className="w-4/5 h-5 rounded-lg bg-thirdary/60" />
            </div>

            {/* Card footer skeleton matching "Baca selengkapnya →" */}
            <div className="pt-4 mt-auto flex items-center justify-between">
              <div className="w-28 h-3.5 rounded bg-thirdary/60" />
              <div className="w-4 h-3.5 rounded bg-thirdary/50" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
