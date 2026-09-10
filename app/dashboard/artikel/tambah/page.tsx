import ArticleForm from '@/components/ArticleForm'

export default function TambahArtikelPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-text-secondary/15 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-text-secondary/20 bg-thirdary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Editor / New Entry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
            Tulis Artikel Baru
          </h1>
          <p className="mt-2 text-sm text-text-secondary max-w-xl">
            Tuangkan pemikiran, dokumentasikan insight baru, atau bagikan eksperimen teknis kamu.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-text-secondary bg-thirdary/60 border border-text-secondary/15 px-3.5 py-1.5 rounded-full w-fit">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          <span>Draft baru (belum terbit)</span>
        </div>
      </div>

      <ArticleForm mode="create" />
    </div>
  )
}
