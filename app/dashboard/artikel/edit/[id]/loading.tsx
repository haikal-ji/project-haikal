export default function EditArtikelLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-text-secondary/15 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-text-secondary/20 bg-thirdary px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3 w-36 h-6" />
          <div className="h-9 sm:h-10 w-52 rounded-2xl bg-thirdary/80 mb-2" />
          <div className="h-4 w-80 sm:w-96 rounded-lg bg-thirdary/50" />
        </div>

        <div className="w-28 h-8 rounded-full bg-thirdary/60 border border-text-secondary/15 shrink-0" />
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Title & Editor */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Title Input */}
          <div className="rounded-2xl border border-text-secondary/15 bg-thirdary/40 backdrop-blur-md p-5 sm:p-6 shadow-xs space-y-3">
            <div className="w-32 h-4 rounded bg-thirdary/70" />
            <div className="w-full h-12 rounded-xl bg-thirdary/50 border border-text-secondary/20" />
          </div>

          {/* Card 2: Rich Text Editor */}
          <div className="rounded-2xl border border-text-secondary/15 bg-thirdary/40 backdrop-blur-md p-4 sm:p-7 shadow-xs space-y-4">
            {/* Toolbar Skeleton */}
            <div className="flex flex-wrap items-center gap-2 border-b border-text-secondary/10 pb-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-lg bg-thirdary/70" />
              ))}
            </div>

            {/* Content Lines */}
            <div className="min-h-[320px] space-y-3 pt-2">
              <div className="w-full h-4 rounded bg-thirdary/60" />
              <div className="w-11/12 h-4 rounded bg-thirdary/60" />
              <div className="w-4/5 h-4 rounded bg-thirdary/50" />
              <div className="w-full h-4 rounded bg-thirdary/60 mt-6" />
              <div className="w-3/4 h-4 rounded bg-thirdary/50" />
            </div>
          </div>
        </div>

        {/* Right Column: Cover & Actions */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Panel 1: Cover Image */}
          <div className="rounded-2xl border border-text-secondary/15 bg-thirdary/40 backdrop-blur-md p-5 sm:p-6 shadow-xs space-y-4">
            <div className="w-28 h-4 rounded bg-thirdary/70" />
            <div className="min-h-[190px] rounded-xl border-2 border-dashed border-text-secondary/20 bg-background/40 flex flex-col items-center justify-center p-6 space-y-2">
              <div className="w-10 h-10 rounded-full bg-thirdary/70" />
              <div className="w-32 h-3.5 rounded bg-thirdary/60" />
              <div className="w-40 h-3 rounded bg-thirdary/40" />
            </div>
          </div>

          {/* Panel 2: Publishing Actions */}
          <div className="rounded-2xl border border-text-secondary/15 bg-thirdary/40 backdrop-blur-md p-5 sm:p-6 shadow-xs space-y-4">
            <div className="w-24 h-4 rounded bg-thirdary/70" />
            <div className="space-y-2.5">
              <div className="flex justify-between py-2 border-b border-text-secondary/10">
                <div className="w-16 h-3.5 rounded bg-thirdary/60" />
                <div className="w-24 h-3.5 rounded bg-thirdary/70" />
              </div>
              <div className="flex justify-between py-2 border-b border-text-secondary/10">
                <div className="w-16 h-3.5 rounded bg-thirdary/60" />
                <div className="w-24 h-3.5 rounded bg-thirdary/70" />
              </div>
            </div>

            <div className="pt-2 space-y-2.5">
              <div className="w-full h-11 rounded-full bg-thirdary/80" />
              <div className="w-full h-10 rounded-full bg-thirdary/40 border border-text-secondary/15" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
