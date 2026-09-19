import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Collection | Haikal',
  description: 'Arsip karya, eksperimen visual, dan bentuk-bentuk yang pernah saya buat.',
}

const projects = [
  {
    number: '01',
    name: 'Do You Read Me?',
    description: 'Eksplorasi poster editorial bergaya halftone retro dan zine kontemporer. Memadukan grafis bintang biru berani, tipografi eksperimental, dan tekstur raster yang ekspresif.',
    image: '/31.jpg',
    tags: ['Editorial Poster', 'Halftone Art', 'Visual Exploration'],
  },
  {
    number: '02',
    name: 'Enjoy the World',
    description: 'Eksplorasi poster tipografi bernuansa vintage dan nostalgia alam. Menghadirkan kontras visual antara kursi merah tunggal di padang rumput hijau dengan tipografi retro yang hangat dan reflektif.',
    image: '/30.jpg',
    tags: ['Vintage Poster', 'Typography Art', 'Visual Exploration'],
  },
  {
    number: '03',
    name: 'Mikir Kidz',
    description: 'Karya seni poster satir dan kritik sosial dengan gaya pop-art kontemporer. Memadukan tipografi bold, ilustrasi ekspresif bergaya zine punk, dan palet warna kontras yang mencolok.',
    image: '/29.jpg',
    tags: ['Social Satire', 'Pop Art Poster', 'Visual Criticism'],
  },
  {
    number: '04',
    name: 'No Fear',
    description: 'Poster tipografi bergaya brutalist dan seni klasik. Mengangkat narasi keberanian dan keteguhan hati lewat kontras tipografi merah bertekstur tebal dengan komposisi visual yang dramatis.',
    image: '/32.jpg',
    tags: ['Brutalist Poster', 'Editorial Art', 'Visual Narrative'],
  },
]

import DecryptedText from '@/components/DecryptedText'

export default function CollectionPage() {
  return (
    <main className="collection-reference-page">
      <header className="collection-reference-heading">
        <p className="section-index">Collection</p>
        <h1>
          <DecryptedText
            text="Selected Works"
            animateOn="inViewHover"
            speed={120}
            maxIterations={12}
            sequential
            revealDirection="start"
            useOriginalCharsOnly={false}
          />
        </h1>
        <p>Kumpulan project, eksperimen visual, dan bentuk-bentuk yang pernah saya buat.</p>
      </header>

      <div className="collection-reference-grid">
        {projects.map((project) => (
          <article key={project.number} className="collection-reference-card">
              <div className="collection-reference-image">
              <Image
                src={project.image}
                alt={project.name}
                width={600}
                height={600}
                className={project.image.includes('29') ? '!scale-110' : ''}
              />
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
