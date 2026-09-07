import ArticleForm from '@/components/ArticleForm'

export default function TambahArtikelPage() {
  return (
    <div className="editor-page-shell">
      <div className="editor-page-topbar">
        <div>
          <p className="dashboard-kicker">Library / New entry</p>
          <h1>Tulis artikel</h1>
        </div>
        <span className="editor-draft-state"><i /> Draft baru</span>
      </div>
      <ArticleForm mode="create" />
    </div>
  )
}
