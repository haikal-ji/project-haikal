import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ScrollReveal from '@/components/ScrollReveal'
import TypewriterText from '@/components/TypewriterText'

export const dynamic = 'force-dynamic'

const projects = [
  {
    number: '01',
    name: 'Raw Anatomy',
    description: 'Entitas tanpa suara yang mendiami batas antara intuisi dan realita. Dibuat sebagai jurnal visual untuk menampung ekspresi mentah, narasi tersembunyi, dan eksplorasi bentuk.',
    tech: 'DESIGN / DIRECTION',
    link: '',
  },
  {
    number: '02',
    name: 'Ephemera',
    description: 'Metamorfosis bentuk dan ide dalam garis-garis sederhana. Menangkap momen presisi di mana keindahan alam bertemu dengan ketenangan garis lukis',
    tech: 'DESIGN / DIRECTION',
    link: '',
  },
  {
    number: '03',
    name: 'Celestial Gaze',
    description: 'Entitas surgawi dalam wujud garis monokrom. Menghadirkan kembali estetika ukiran klasik ke dalam konteks desain modern.',
    tech: 'DESIGN / DIRECTION',
    link: '',
  },
]

export default async function HomePage() {
  const latestArticles = await prisma.article.findMany({
    orderBy: { created_at: 'desc' },
    take: 3,
  })

  return (
    <div className="overflow-hidden">
      <section className="hero-section border-b border-line">
        <div className="hero-copy">
          <p className="eyebrow">Web developer / creative technologist</p>
          <h1 className="font-serif text-5xl leading-[0.94] tracking-[-0.03em] md:text-7xl">
            <TypewriterText text="Belajar membangun web, satu project pada satu waktu." />
          </h1>
          <p className="mt-7 max-w-sm text-sm leading-6 text-foreground/65">
            Hai, saya Haikal. Saya lagi belajar merancang dan membangun website yang rapi, simpel, dan enak diliat.
          </p>
          <Link href="#portofolio" className="editorial-link mt-8 inline-flex items-center gap-3">
            Lihat Karya saya <span aria-hidden="true">↘</span>
          </Link>
        </div>
        <div className="hero-collage" aria-label="Kolase tekstur dan bentuk alami">
          <div className="hero-image hero-image-one" />
          <div className="hero-image hero-image-two" />
          <div className="hero-image hero-image-three" />
          <span className="hero-stamp">Selected<br />works</span>
        </div>
      </section>

      <ScrollReveal>
        <section className="intro-section">
          <p className="section-index">tentang</p>
          <div>
            <h2 className="max-w-3xl font-serif text-4xl leading-tight md:text-6xl">
              Masih belajar, tapi senang membuat sesuatu dari nol.
            </h2>
            <p className="mt-8 max-w-xl text-base leading-7 text-foreground/65">
              Website ini sendiri adalah bagian dari proses belajar saya — mulai dari database, autentikasi, sampai desain tampilan. Ada cerita lebih lengkap di halaman Tentang.
            </p>
            <Link href="/about" className="editorial-link mt-8 inline-flex items-center gap-3">
              Kenali saya <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>
      </ScrollReveal>

      <section id="portofolio" className="portfolio-section">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="section-index">karya yang saya buat</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">Beberapa hal yang pernah saya buat</h2>
          </div>
          <span className="hidden text-xs uppercase tracking-[0.18em] text-foreground/50 md:block">2026 — sekarang</span>
        </div>
        <div className="project-grid">
          {projects.map((project, i) => (
            <ScrollReveal key={project.name}>
              <article className={`project-item ${i === 0 ? 'project-featured' : ''}`}>
                <div className={`project-image project-image-${i + 1}`} />
                <div className="mt-5 flex items-start justify-between gap-5">
                  <div>
                    <p className="mb-2 text-xs text-clay">{project.number}</p>
                    <h3 className="font-serif text-2xl">{project.name}</h3>
                    <p className="mt-3 max-w-sm text-sm leading-6 text-foreground/65">{project.description}</p>
                  </div>
                  <p className="shrink-0 text-right text-[10px] uppercase tracking-[0.16em] text-foreground/45">{project.tech}</p>
                </div>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="editorial-link mt-5 inline-flex"
                  >
                    Buka project ↗
                  </a>
                )}
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <ScrollReveal>
        <section className="journal-section">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="section-index">03 / jurnal</p>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl">Catatan terbaru</h2>
            </div>
            <Link href="/artikel" className="editorial-link hidden md:inline-flex">Semua catatan ↗</Link>
          </div>
          <div className="journal-list">
            {latestArticles.map((article) => (
              <Link
                key={article.id}
                href={`/artikel/${article.id}`}
                className="journal-item group"
              >
                {article.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={article.thumbnail}
                    alt={article.title}
                    className="h-20 w-24 shrink-0 object-cover grayscale transition duration-500 group-hover:grayscale-0"
                  />
                ) : (
                  <div className="h-20 w-24 shrink-0 bg-line" />
                )}
                <div className="flex flex-1 items-center justify-between gap-6">
                  <span className="font-serif text-xl">{article.title}</span>
                  <span className="shrink-0 text-xs uppercase tracking-[0.12em] text-foreground/50">
                    {new Date(article.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </Link>
            ))}
            {latestArticles.length === 0 && (
              <p className="py-6 text-foreground/50">Belum ada catatan.</p>
            )}
          </div>
          <Link href="/artikel" className="editorial-link mt-7 inline-flex md:hidden">Semua catatan ↗</Link>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="contact-section">
          <p className="section-index">04 / mari ngobrol</p>
          <h2 className="mt-6 max-w-3xl font-serif text-5xl leading-[0.95] tracking-[-0.03em] md:text-7xl">
            Punya ide yang ingin diberi bentuk?
          </h2>
          <a href="mailto:mlbbus0208@gmail.com" className="editorial-link mt-8 inline-flex items-center gap-3">
            mlbbus0208@gmail.com <span aria-hidden="true">↗</span>
          </a>
        </section>
      </ScrollReveal>
    </div>
  )
}
