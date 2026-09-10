export default function ArtikelLoading() {
  return (
    <main className="articles-page">
      <header className="articles-heading">
        <div className="section-index" style={{ width: 120, height: 12, background: '#29292e', borderRadius: 2 }} />
        <div style={{ marginTop: 22, width: '55%', height: 80, background: '#29292e', borderRadius: 2 }} />
        <div style={{ marginTop: 27, width: 260, height: 18, background: '#29292e', borderRadius: 2 }} />
      </header>
      <div className="articles-list">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="article-list-row"
            style={{ opacity: 1 - i * 0.18 }}
          >
            <div style={{ width: 24, height: 14, background: '#29292e', borderRadius: 2 }} />
            <div style={{ width: 230, height: 150, background: '#29292e', borderRadius: 2 }} />
            <div style={{ padding: '8px 0' }}>
              <div style={{ width: 120, height: 11, background: '#29292e', borderRadius: 2 }} />
              <div style={{ marginTop: 18, width: '70%', height: 44, background: '#202024', borderRadius: 2 }} />
              <div style={{ marginTop: 30, width: 80, height: 11, background: '#29292e', borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
