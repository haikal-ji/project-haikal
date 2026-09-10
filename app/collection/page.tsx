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
    image: '/9.jpg',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS'],
  },
  {
    number: '02',
    name: 'Ephemera',
    description: 'Metamorfosis bentuk dan ide dalam garis-garis sederhana. Menangkap momen presisi di mana keindahan alam bertemu dengan ketenangan garis lukis.',
    image: '/8.png',
    tags: ['React', 'Figma', 'UI/UX'],
  },
  {
    number: '03',
    name: 'Celestial Gaze',
    description: 'Entitas surgawi dalam wujud garis monokrom. Menghadirkan kembali estetika ukiran klasik ke dalam konteks desain modern.',
    image: '/5.jpg',
    tags: ['Prisma', 'PostgreSQL', 'Next.js'],
  },
  {
    number: '04',
    name: 'Nocturnal Visage',
    description: 'Potret teaterikal yang mengaburkan batas antara komedi dan tragedi. Menangkap keheningan seorang pelakon melalui kontras hitam-putih yang dramatis.',
    image: '/24.png',
    tags: ['Next.js', 'Supabase', 'Motion'],
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
              <span className="collection-reference-number">{project.number}</span>
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
