import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Collection | Haikal',
  description: 'Arsip karya, eksperimen visual, dan bentuk-bentuk yang pernah saya buat.',
}

const projects = [
  {
    number: '01',
    name: 'Raw Anatomy',
    description: 'Entitas tanpa suara yang mendiami batas antara intuisi dan realita. Dibuat sebagai jurnal visual untuk menampung ekspresi mentah, narasi tersembunyi, dan eksplorasi bentuk.',
    image: 'collection-image-one',
  },
  {
    number: '02',
    name: 'Ephemera',
    description: 'Metamorfosis bentuk dan ide dalam garis-garis sederhana. Menangkap momen presisi di mana keindahan alam bertemu dengan ketenangan garis lukis',
    image: 'collection-image-two',
  },
  {
    number: '03',
    name: 'Celestial Gaze',
    description: 'Entitas surgawi dalam wujud garis monokrom. Menghadirkan kembali estetika ukiran klasik ke dalam konteks desain modern.',
    image: 'collection-image-three',
  },
  {
    number: '04',
    name: 'Nocturnal Visage',
    description: 'Potret teaterikal yang mengaburkan batas antara komedi dan tragedi. Menangkap keheningan seorang pelakon melalui kontras hitam-putih yang dramatis..',
    image: 'collection-image-four',
  },
]

export default function CollectionPage() {
  return (
    <main className="standalone-page collection-page">
      <header className="standalone-heading">
        <p className="section-index">Collection</p>
        <h1 className="font-serif">Arsip karya</h1>
        <p>Kumpulan project, eksperimen visual, dan bentuk-bentuk yang pernah saya buat.</p>
      </header>
      <div className="collection-grid">
        {projects.map((project) => (
          <article key={project.number} className="collection-item">
            <div className={`collection-image ${project.image}`} />
            <div className="collection-item-meta">
              <h2 className="font-serif">{project.name}</h2>
              <span>{project.number}</span>
            </div>
            <p>{project.description}</p>
          </article>
        ))}
      </div>
      <Link href="/" className="editorial-link standalone-back">← Kembali ke beranda</Link>
    </main>
  )
}
