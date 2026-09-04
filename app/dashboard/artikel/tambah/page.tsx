import ArticleForm from '@/components/ArticleForm'

export default function TambahArtikelPage() {
  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-2xl font-semibold">Tambah Artikel</h1>
      <ArticleForm mode="create" />
    </div>
  )
}
