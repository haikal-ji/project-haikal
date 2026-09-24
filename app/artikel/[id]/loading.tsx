export default function ArtikelDetailLoading() {
  return (
    <main className="min-h-screen bg-background text-text-primary px-6 pt-24 sm:pt-28 pb-20 md:px-10 md:pt-32 md:pb-24 max-w-4xl mx-auto transition-colors duration-200 animate-pulse">
      {/* 1. Back to Articles button skeleton */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-text-secondary/15 bg-thirdary/40 w-36 h-8" />
      </div>

      {/* 2. Editorial Header skeleton */}
      <header className="mb-8">
        {/* Category Badge */}
        <div className="inline-flex items-center rounded-full border border-text-secondary/15 bg-thirdary/50 w-36 h-6 mb-4" />

        {/* Title skeleton (matching 3xl sm:5xl lg:6xl font-black) */}
        <div className="space-y-3 mb-6">
          <div className="h-10 sm:h-14 w-11/12 rounded-2xl bg-thirdary/60" />
          <div className="h-10 sm:h-14 w-3/5 rounded-2xl bg-thirdary/40" />
        </div>

        {/* Author Meta Strip skeleton (matching border-y border-text-secondary/15 py-4 my-8) */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-text-secondary/15 py-4 my-8">
          {/* Author avatar & name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-thirdary/70 shrink-0 border border-text-secondary/10" />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-28 h-4 rounded-md bg-thirdary/70" />
                <div className="w-14 h-4 rounded-full bg-thirdary/30" />
              </div>
              <div className="w-36 h-3 rounded-md bg-thirdary/40" />
            </div>
          </div>

          {/* Meta timestamps & stats */}
          <div className="flex items-center gap-3">
            <div className="w-28 h-3.5 rounded-md bg-thirdary/50" />
            <span className="opacity-30">·</span>
            <div className="w-20 h-3.5 rounded-md bg-thirdary/50" />
            <span className="opacity-30">·</span>
            <div className="w-16 h-3.5 rounded-md bg-thirdary/50" />
          </div>
        </div>
      </header>

      {/* 3. Hero Thumbnail skeleton */}
      <div className="aspect-[16/10] sm:aspect-[16/9] w-full rounded-3xl bg-thirdary/30 border border-text-secondary/15 my-10" />

      {/* 4. Article Content skeleton paragraphs */}
      <div className="space-y-4 my-12 max-w-none">
        <div className="w-full h-4 rounded-md bg-thirdary/60" />
        <div className="w-full h-4 rounded-md bg-thirdary/60" />
        <div className="w-11/12 h-4 rounded-md bg-thirdary/50" />
        <div className="w-4/5 h-4 rounded-md bg-thirdary/40" />

        <div className="pt-6 space-y-4">
          <div className="w-full h-4 rounded-md bg-thirdary/60" />
          <div className="w-full h-4 rounded-md bg-thirdary/60" />
          <div className="w-3/4 h-4 rounded-md bg-thirdary/40" />
        </div>
      </div>

      {/* 5. Bottom Reactions Strip skeleton */}
      <div className="border-t border-text-secondary/15 pt-8 mt-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-24 h-9 rounded-full bg-thirdary/50 border border-text-secondary/15" />
          <div className="w-24 h-9 rounded-full bg-thirdary/50 border border-text-secondary/15" />
        </div>
        <div className="w-28 h-9 rounded-full bg-thirdary/50 border border-text-secondary/15" />
      </div>
    </main>
  )
}
