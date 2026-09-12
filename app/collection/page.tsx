import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Collection | Haikal',
  description: 'Arsip karya, eksperimen visual, dan bentuk-bentuk yang pernah saya buat.',
}

const projects = [
  {
    number: '01',
    name: 'OVRTHINK',
    description: 'Eksplorasi visual dan identitas streetwear modern. Menggabungkan tipografi minimalis, fotografi fashion urban, dan komposisi editorial kontemporer.',
    image: '/25.png',
    tags: ['Fashion & Editorial', 'Brand Identity', 'Visual Design'],
  },
  {
    number: '02',
    name: 'Matcha Cream Latte',
    description: 'Desain poster promosi minuman dengan sentuhan dinamis dan elegan. Komposisi visual splash matcha dengan palet warna earthy pastel yang menonjolkan kesegaran.',
    image: '/26.png',
    tags: ['Poster Design', 'Commercial Art', 'Beverage Branding'],
  },
  {
    number: '03',
    name: 'Puding Mas Hambali',
    description: 'Poster promosi kuliner dessert bergaya playful dan hangat. Menghadirkan fotografi produk yang menggugah selera dengan tipografi hand-drawn yang ramah.',
    image: '/27.png',
    tags: ['Culinary Branding', 'Social Media Ads', 'Graphic Design'],
  },
  {
    number: '04',
    name: 'Promo Tiap Hari',
    description: 'Materi promosi bundling kopi harian Aksara Caffè dengan nuansa warm coffee tone yang hangat, estetik, dan komunikatif untuk kampanye digital.',
    image: '/28.png',
    tags: ['Campaign Poster', 'Advertising', 'Visual Identity'],
  },
]

export default function CollectionPage() {
  return (
    <main className="collection-reference-page">
      <header className="collection-reference-heading">
        <p className="section-index">Collection</p>
        <h1>Selected Works</h1>
        <p>Kumpulan project, eksperimen visual, dan bentuk-bentuk yang pernah saya buat.</p>
      </header>

      <div className="collection-reference-grid">
        {projects.map((project) => (
          <article key={project.number} className="collection-reference-card">
              <div className="collection-reference-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.image} alt={project.name} />
            </div>
            <div className="collection-reference-body">
              <div className="collection-reference-tags">
                {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              <h2>{project.name}</h2>
              <p>{project.description}</p>
              <Link href="/#projects" className="collection-reference-link">
                View details
              </Link>
            </div>
          </article>
        ))}
      </div>

      <Link href="/" className="collection-reference-back">← Kembali ke beranda</Link>
    </main>
  )
}
