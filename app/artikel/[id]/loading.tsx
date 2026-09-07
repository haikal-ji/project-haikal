export default function ArtikelDetailLoading() {
  return (
    <main className="article-detail-page">
      <div style={{ width: 130, height: 12, background: '#e0d8cc', borderRadius: 2 }} />
      <header className="article-detail-heading">
        <div style={{ width: 90, height: 11, background: '#e0d8cc', borderRadius: 2, margin: '0 auto' }} />
        <div style={{ marginTop: 24, width: '75%', height: 80, background: '#ddd5c6', borderRadius: 2, margin: '24px auto 0' }} />
        <div style={{ marginTop: 25, width: 140, height: 11, background: '#e0d8cc', borderRadius: 2, margin: '25px auto 0' }} />
      </header>
      <div style={{ width: 'min(100%, 980px)', height: 480, background: '#e0d8cc', borderRadius: 2, margin: '0 auto 70px', display: 'block' }} />
      <div className="article-detail-content" style={{ maxWidth: 700, margin: '0 auto' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ height: 18, background: '#e0d8cc', borderRadius: 2, marginBottom: 16, width: i % 3 === 2 ? '65%' : '100%' }} />
        ))}
      </div>
    </main>
  )
}
