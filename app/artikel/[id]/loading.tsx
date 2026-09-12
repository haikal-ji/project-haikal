export default function ArtikelDetailLoading() {
  return (
    <main className="min-h-screen bg-background text-text-primary px-6 pt-24 sm:pt-28 pb-20 md:px-10 md:pt-32 md:pb-24 max-w-4xl mx-auto animate-pulse">
      {/* Back button skeleton */}
      <div className="mb-8">
        <div className="w-28 h-7 rounded-full bg-thirdary/60 border border-text-secondary/15" />
      </div>

      {/* Header skeleton */}
      <header className="mb-8 space-y-4">
        <div className="w-36 h-6 rounded-full bg-thirdary/60" />
        <div className="w-4/5 h-12 sm:h-16 rounded-2xl bg-thirdary/80" />
        <div className="w-3/5 h-10 sm:h-12 rounded-2xl bg-thirdary/60" />

        {/* Author Strip skeleton */}
        <div className="flex items-center justify-between border-y border-text-secondary/15 py-4 my-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-thirdary/80" />
            <div className="space-y-1.5">
              <div className="w-28 h-4 rounded bg-thirdary/80" />
              <div className="w-36 h-3 rounded bg-thirdary/50" />
            </div>
          </div>
          <div className="w-40 h-4 rounded bg-thirdary/50 hidden sm:block" />
        </div>
      </header>

      {/* Hero Image skeleton */}
      <div className="aspect-[16/9] w-full rounded-3xl bg-thirdary/40 border border-text-secondary/15 my-10" />

      {/* Content paragraphs */}
      <div className="space-y-4 my-12 max-w-3xl">
        <div className="w-full h-4 rounded bg-thirdary/60" />
        <div className="w-11/12 h-4 rounded bg-thirdary/60" />
        <div className="w-4/5 h-4 rounded bg-thirdary/50" />
        <div className="w-full h-4 rounded bg-thirdary/60 mt-6" />
        <div className="w-3/4 h-4 rounded bg-thirdary/50" />
      </div>
    </main>
  )
}

