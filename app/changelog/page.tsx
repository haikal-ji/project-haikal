import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Changelog | Haikal',
  description: 'Catatan perkembangan dan perubahan pada personal project Haikal.',
}

const updates = [
  { version: 'v1.4', date: '08 September 2026', title: 'Polish dan motion', detail: 'Menambahkan animasi reveal saat scroll, parallax pada hero, dark mode warm espresso, dan perbaikan tampilan editor artikel.' },
  { version: 'v1.3', date: '07 September 2026', title: 'Artikel dan tracking', detail: 'Menambahkan pencarian artikel, view count real-time, halaman detail artikel, serta dukungan komentar dan reaksi.' },
  { version: 'v1.2', date: '06 September 2026', title: 'Struktur personal website', detail: 'Merapikan homepage, About, Collection, Contact, dan menyusun ulang portofolio menjadi beberapa section editorial.' },
  { version: 'v1.0', date: '02 September 2026', title: 'Project dimulai', detail: 'Membuat fondasi personal project dengan Next.js, database Prisma, autentikasi, dan dashboard untuk mengelola artikel.' },
]

export default function ChangelogPage() {
  return (
    <main className="standalone-page changelog-page">
      <header className="standalone-heading">
        <p className="section-index">Changelog / Log</p>
        <h1 className="font-serif">Catatan perkembangan</h1>
        <p>Jurnal singkat tentang fitur, perbaikan, dan hal-hal yang saya pelajari selama mengembangkan website ini.</p>
      </header>
      <div className="changelog-list">
        {updates.map((update) => (
          <article key={update.version} className="changelog-item">
            <div className="changelog-meta"><span>{update.version}</span><time>{update.date}</time></div>
            <div><h2 className="font-serif">{update.title}</h2><p>{update.detail}</p></div>
          </article>
        ))}
      </div>
      <Link href="/" className="editorial-link standalone-back">← Kembali ke beranda</Link>
    </main>
  )
}
