import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Uses | Haikal',
  description: 'Tools, software, dan teknologi yang saya gunakan untuk belajar dan membuat project.',
}

const stack = [
  { category: 'Build', title: 'Next.js', detail: 'Framework utama untuk membangun website dengan React.' },
  { category: 'Data', title: 'Prisma + PostgreSQL', detail: 'Mengelola data artikel, komentar, reaksi, dan view count.' },
  { category: 'Auth', title: 'Supabase', detail: 'Autentikasi pengguna dan sinkronisasi akun.' },
  { category: 'Design', title: 'Figma', detail: 'Menyusun ide layout, referensi, dan eksplorasi UI.' },
  { category: 'Editor', title: 'VS Code', detail: 'Tempat menulis, menguji, dan merapikan kode setiap hari.' },
  { category: 'Workflow', title: 'Git + GitHub', detail: 'Menyimpan perubahan dan mendokumentasikan perkembangan project.' },
]

export default function UsesPage() {
  return (
    <main className="standalone-page uses-page">
      <header className="standalone-heading">
        <p className="section-index">Uses / Stack</p>
        <h1 className="font-serif">Tools yang saya gunakan</h1>
        <p>Perangkat, software, dan teknologi yang membantu saya belajar dan membuat sesuatu dari nol.</p>
      </header>
      <div className="uses-list">
        {stack.map((item, index) => (
          <article key={item.title} className="uses-item">
            <span className="uses-number">{String(index + 1).padStart(2, '0')}</span>
            <span className="uses-category">{item.category}</span>
            <div>
              <h2 className="font-serif">{item.title}</h2>
              <p>{item.detail}</p>
            </div>
          </article>
        ))}
      </div>
      <Link href="/" className="editorial-link standalone-back">← Kembali ke beranda</Link>
    </main>
  )
}
