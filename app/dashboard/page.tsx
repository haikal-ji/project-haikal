import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import DeleteArticleButton from './DeleteArticleButton'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const articles = await prisma.article.findMany({
    orderBy: { created_at: 'desc' },
  })

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <Link href="/" className="dashboard-brand">HAiKAL<span>.</span></Link>
        <p className="dashboard-label">Workspace</p>
        <nav className="dashboard-nav" aria-label="Navigasi dashboard">
          <Link href="/dashboard" className="dashboard-nav-active"><span>◌</span> Overview</Link>
          <Link href="/dashboard/artikel/tambah"><span>＋</span> Tulis artikel</Link>
          <Link href="/artikel"><span>↗</span> Lihat website</Link>
        </nav>
        <div className="dashboard-sidebar-note">
          <span className="dashboard-status-dot" />
          <p>Ruang kerja pribadi<br /><span>Semua perubahan tersimpan di project.</span></p>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <p className="dashboard-kicker">Selasa, 8 September 2026</p>
            <h1>Selamat datang kembali.</h1>
          </div>
          <Link href="/dashboard/artikel/tambah" className="dashboard-primary-action">
            <span aria-hidden="true">＋</span> Artikel baru
          </Link>
        </header>

        <section className="dashboard-intro">
          <div>
            <p className="dashboard-kicker">Content desk</p>
            <h2>Ide yang sudah menemukan bentuk.</h2>
          </div>
          <p>{articles.length === 0 ? 'Mulai dengan menulis catatan pertamamu.' : 'Kelola catatan, proses, dan cerita yang ingin kamu bagikan.'}</p>
        </section>

        <section className="dashboard-stats" aria-label="Ringkasan artikel">
          <div className="dashboard-stat dashboard-stat-featured">
            <span className="dashboard-stat-label">Total artikel</span>
            <strong>{String(articles.length).padStart(2, '')}</strong>
            <span className="dashboard-stat-meta">Catatan yang tersimpan</span>
          </div>
          <div className="dashboard-stat">
            <span className="dashboard-stat-label">Terakhir ditulis</span>
            <strong>{articles[0] ? new Date(articles[0].created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) : '—'}</strong>
            <span className="dashboard-stat-meta">Update terbaru</span>
          </div>
          <div className="dashboard-stat">
            <span className="dashboard-stat-label">Dengan cover</span>
            <strong>{String(articles.filter((article) => article.thumbnail).length).padStart(2, '')}</strong>
            <span className="dashboard-stat-meta">Artikel punya thumbnail</span>
          </div>
        </section>

        <section className="dashboard-articles">
          <div className="dashboard-section-heading">
            <div>
              <p className="dashboard-kicker">Library</p>
              <h2>Artikel kamu</h2>
            </div>
            <span>{articles.length} item</span>
          </div>

          {articles.length > 0 ? (
            <div className="dashboard-article-list">
              {articles.map((article, index) => (
                <article key={article.id} className="dashboard-article-row">
                  <span className="dashboard-row-number">{String(index + 1).padStart(2, '0')}</span>
                  {article.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={article.thumbnail} alt="" className="dashboard-article-thumb" />
                  ) : (
                    <div className="dashboard-article-thumb dashboard-article-thumb-empty" aria-hidden="true"><span>Haikal</span></div>
                  )}
                  <div className="dashboard-article-copy">
                    <h3>{article.title}</h3>
                    <p>Dipublikasikan · {new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <span className="dashboard-article-status"><i /> Live</span>
                  <div className="dashboard-article-actions">
                    <Link href={`/dashboard/artikel/edit/${article.id}`} aria-label={`Edit ${article.title}`}>Edit</Link>
                    <DeleteArticleButton id={article.id} />
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="dashboard-empty-state">
              <span className="dashboard-empty-mark">✦</span>
              <h3>Belum ada artikel.</h3>
              <p>Ruang ini siap diisi dengan catatan pertamamu.</p>
              <Link href="/dashboard/artikel/tambah" className="editorial-link">Mulai menulis ↗</Link>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
