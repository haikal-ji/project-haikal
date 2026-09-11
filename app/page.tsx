import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import TextType from '@/components/TextType'
import ScrollVelocity from '@/components/ScrollVelocity'
import TechIcon from '@/components/TechIcon'
import ContactSection from '@/components/ContactSection'
import ScrollStack, { ScrollStackItem } from '@/components/ScrollStack'
import BlurReveal from '@/components/BlurReveal'
import AccordionGallery from '@/components/AccordionGallery'
import Stack from '@/components/Stack'
import ArrowUpRight from '@/components/ui/ArrowUpRight'

export const dynamic = 'force-dynamic'

const projects = [
  {
    number: '01',
    name: 'Raw Anatomy',
    description: 'Entitas tanpa suara yang mendiami batas antara intuisi dan realita. Dibuat sebagai jurnal visual untuk menampung ekspresi mentah, narasi tersembunyi, dan eksplorasi bentuk.',
    image: '/9.jpg',
    tags: [''],
  },
  {
    number: '02',
    name: 'Ephemera',
    description: 'Metamorfosis bentuk dan ide dalam garis-garis sederhana. Menangkap momen presisi di mana keindahan alam bertemu dengan ketenangan garis lukis.',
    image: '/8.png',
    tags: [''],
  },
  {
    number: '03',
    name: 'Celestial Gaze',
    description: 'Entitas surgawi dalam wujud garis monokrom. Menghadirkan kembali estetika ukiran klasik ke dalam konteks desain modern.',
    image: '/5.jpg',
    tags: [''],
  },
  {
    number: '04',
    name: 'Nocturnal Visage',
    description: 'Potret teaterikal yang mengaburkan batas antara komedi dan tragedi. Menangkap keheningan seorang pelakon melalui kontras hitam-putih yang dramatis.',
    image: '/24.png',
    tags: [''],
  },
]

const experiences = [
  {
    period: '2024 — 2025',
    title: 'HTML & CSS Basics',
    place: 'SMK - RPL CLASS',
    description: 'Pengalaman pertama mengenal dunia pemrograman saat memasuki kelas RPL SMK. Mengikuti pembelajaran dasar front-end mulai dari menyusun tag HTML hingga membuat tampilan halaman web sederhana pertama.',
    tools: ['Html', 'Css', 'Web basic', ],
  },
  {
    period: '2025 — 2026',
    title: 'Basic PHP & Database',
    place: 'SMK - RPL CLASS',
    description: 'Mempelajari dasar-dasar pemrograman back-end menggunakan PHP dan pengelolaan database dengan XAMPP, mulai dari logika pengondisian, manipulasi data, hingga integrasi database ke halaman web..',
    tools: ['PHP', 'Database', 'XAMPP', 'Web basic'],
  },
  {
    period: '2026 — sekarang',
    title: 'Learning Fullstack & Tools',
    place: 'PKL',
    description: 'Tahap eksplorasi teknologi modern untuk memperluas wawasan development. Mulai mempelajari dasar framework web dan mobile (Next.js, Laravel, React Native) dengan TypeScript dan Tailwind CSS, pengelolaan database (PostgreSQL, Supabase, Prisma), penyiapan lingkungan kerja (Docker, GitHub, Vercel), serta proses desain UI/UX di Figma..',
    tools: ['Figma', 'NEXT.JS', 'LARAVEL', 'REACT NATIVE', 'SUPABASE', 'DOCKER', 'GITHUB', 'PRISMA'],
  },
]

const skillGroups = [
  {
    title: 'Frontend',
    note: 'Frameworks and libraries for building interactive, fluid user interfaces.',
    items: ['React Native', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Figma'],
  },
  {
    title: 'Backend & Database',
    note: 'Server-side data layers, schemas, and modern connected services.',
    items: ['Prisma ORM', 'Supabase', 'PostgreSQL'],
  },
  {
    title: 'Tools & Workflow',
    note: 'Essential development tools, version control, and deployment pipelines.',
    items: ['Docker', 'Git', 'GitHub', 'VS Code', 'Vercel'],
  },
]

function getExcerpt(htmlContent: string, maxLength = 150) {
  if (!htmlContent) return ''
  const clean = htmlContent.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > maxLength ? clean.slice(0, maxLength) + '...' : clean
}

function getReadingTime(htmlContent: string) {
  if (!htmlContent) return '1 min read'
  const words = htmlContent.replace(/<[^>]*>?/gm, ' ').trim().split(/\s+/).length
  const minutes = Math.max(1, Math.ceil(words / 180))
  return `${minutes} min read`
}

export default async function HomePage() {
  const latestArticles = await prisma.article.findMany({
    orderBy: { created_at: 'desc' },
    take: 3,
    include: {
      author: true,
      _count: {
        select: {
          reactions: true,
          comments: true,
        },
      },
    },
  })

  return (
    <div className="w-full bg-background text-text-primary selection:bg-text-secondary/20 selection:text-text-primary transition-colors duration-300">
      {/* 1. HERO SECTION */}
      <section
        id="home"
        className="w-full max-w-7xl mx-auto cursor-default grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center px-6 md:px-12 pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden"
      >
        <BlurReveal delay={0.1} className="flex flex-col gap-2">
          <div>
            <h1 className="text-text-primary text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-tight">
              Hi, I&apos;m
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-text-primary via-text-primary/80 to-text-secondary">
                {' '}Haikal
              </span>
            </h1>
          </div>

          <div className="relative flex items-center min-h-[40px]" aria-label="Bidang yang sedang dipelajari">
            <TextType
              as="span"
              text={['RPL Student', 'Web Development & UI', 'Frontend Basics']}
              typingSpeed={75}
              deletingSpeed={50}
              pauseDuration={1500}
              showCursor
              cursorCharacter="_"
              className="text-text-primary text-xl md:text-2xl lg:text-3xl font-bold tracking-tight"
            />
          </div>

          <div className="max-w-xl mt-4">
            <p className="text-text-secondary text-base md:text-lg leading-relaxed font-medium">
              Halo! Saya suka merancang dan membangun sesuatu dari nol. Bagi saya, setiap baris kode adalah cara untuk menghadirkan karya digital yang rapi, bermanfaat, dan terasa tepat.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              href="#projects"
              className="cursor-pointer text-sm md:text-base font-bold bg-text-primary text-background px-8 py-4 rounded-xl flex flex-row items-center justify-center gap-3 hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.1)] transition-all duration-300 ease-out group"
            >
              Explore Work
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
              </svg>
            </Link>
            <Link
              href="/about"
              className="cursor-pointer text-sm md:text-base font-bold border-2 border-text-secondary/20 hover:border-text-primary text-text-primary px-8 py-4 rounded-xl flex flex-row items-center justify-center gap-3 hover:-translate-y-1.5 hover:scale-[1.02] hover:bg-thirdary/40 transition-all duration-300 ease-out bg-background/50 backdrop-blur-sm shadow-[0_4px_10px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_10px_rgba(255,255,255,0.02)]"
            >
              About Me
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-text-secondary/10">
            <span className="text-xs uppercase tracking-widest font-bold text-text-secondary mb-4 block">Connect</span>
            <div className="flex flex-row gap-4">
              <a
                href="https://instagram.com/__02ekall"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 border border-text-secondary/20 rounded-xl hover:border-text-primary hover:bg-text-primary hover:text-background text-text-primary transition-all duration-300"
                title="Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://github.com/haikal-ji"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 border border-text-secondary/20 rounded-xl hover:border-text-primary hover:bg-text-primary hover:text-background text-text-primary transition-all duration-300"
                title="GitHub"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="mailto:mlbbus0208@gmail.com"
                className="p-3 border border-text-secondary/20 rounded-xl hover:border-text-primary hover:bg-text-primary hover:text-background text-text-primary transition-all duration-300"
                title="Email"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>
        </BlurReveal>

        {/* RIGHT COLUMN: CIRCLE PHOTO & EXACT RYHAR STACKED FLOATING BADGES */}
        <BlurReveal delay={0.25} yOffset={25} className="flex flex-col items-center justify-center relative mt-12 md:mt-0 pb-12 sm:pb-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-blue-500/15 to-purple-500/20 rounded-full scale-110 opacity-70 blur-3xl pointer-events-none" />
          <div className="relative z-10 p-2 sm:p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/haikal-hero.jpg"
              alt="Muhammad Haikal"
              className="w-64 h-64 sm:w-80 sm:h-80 lg:w-[380px] lg:h-[380px] rounded-full object-cover [object-position:center_58%] aspect-square transition-all duration-700 hover:scale-[1.02]"
            />
          </div>
          <div className="absolute -bottom-8 left-2 sm:-bottom-10 sm:-left-4 md:-bottom-12 md:-left-10 z-20 flex flex-col gap-2.5 sm:gap-3 max-w-[calc(100%-1rem)] sm:max-w-none">
            <div className="floating flex items-center gap-2.5 sm:gap-3 bg-background/95 dark:bg-[#111111]/95 backdrop-blur-md border border-text-secondary/15 p-2.5 pr-4 sm:p-3 sm:pr-5 rounded-2xl shadow-xl hover:-translate-y-1 transition-transform duration-300">
              <div className="bg-text-primary text-background p-1.5 sm:p-2 rounded-xl shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <span className="text-xs md:text-sm font-semibold text-text-primary whitespace-nowrap">
                Personal Project
              </span>
            </div>
            <div
              className="floating flex items-center gap-2.5 sm:gap-3 bg-background/95 dark:bg-[#111111]/95 backdrop-blur-md border border-text-secondary/15 p-2.5 pr-4 sm:p-3 sm:pr-5 rounded-2xl shadow-xl hover:-translate-y-1 transition-transform duration-300"
              style={{ animationDelay: '150ms' }}
            >
              <div className="bg-text-primary text-background p-1.5 sm:p-2 rounded-xl shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8 8-4 4 4 4m8 0 4-4-4-4m-2-3-4 14" />
                </svg>
              </div>
              <span className="text-xs md:text-sm font-semibold text-text-primary whitespace-nowrap">
                Next.js &amp; TypeScript Stack
              </span>
            </div>
            <div
              className="floating flex items-center gap-2.5 sm:gap-3 bg-background/95 dark:bg-[#111111]/95 backdrop-blur-md border border-text-secondary/15 p-2.5 pr-4 sm:p-3 sm:pr-5 rounded-2xl shadow-xl hover:-translate-y-1 transition-transform duration-300"
              style={{ animationDelay: '300ms' }}
            >
              <div className="bg-text-primary text-background p-1.5 sm:p-2 rounded-xl shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v5M5 12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2M5 12h14m-7 4v3m-4 0h8" />
                </svg>
              </div>
              <span className="text-xs md:text-sm font-semibold text-text-primary whitespace-nowrap">
                Web Development Learner
              </span>
            </div>
          </div>
        </BlurReveal>
      </section>

      {/* 2. ABOUT ME SECTION */}
      <section
        id="about"
        className="w-full max-w-7xl mx-auto py-24 md:py-32 cursor-default bg-background overflow-hidden border-t border-text-secondary/10"
      >
        <BlurReveal className="max-w-7xl mx-auto px-6 md:px-12 mb-16 md:mb-24 w-full text-left">
          <h2 className="text-sm font-bold tracking-[0.2em] text-text-secondary uppercase mb-4">Discover</h2>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter">About Me</h3>
        </BlurReveal>

        <BlurReveal delay={0.15} className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 px-6 md:px-12">
          {/* Left: Photo Card in 4/5 Aspect with DEV Watermark */}
          <div className="lg:col-span-5 hidden lg:flex flex-col items-center justify-center relative">
            <div className="w-full max-w-[360px] lg:max-w-[440px] relative">
              <div className="relative z-10 p-2 bg-background border border-text-secondary/10 rounded-3xl shadow-2xl overflow-hidden aspect-[4/5] w-full group transition-all duration-500 hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_-5px_rgba(255,255,255,0.05)] hover:-translate-y-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/whatsapp.jpeg"
                  alt="Muhammad Haikal"
                  className="object-cover [object-position:center_25%] transition-all duration-700 scale-100 group-hover:scale-105 rounded-2xl w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-40 dark:opacity-60 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-500 rounded-3xl pointer-events-none" />
              </div>
              <div className="absolute -bottom-8 -left-8 text-8xl lg:text-9xl font-black text-text-secondary/5 select-none pointer-events-none tracking-tighter mix-blend-multiply dark:mix-blend-screen z-0">
                DEV.
              </div>
            </div>
          </div>

          {/* Right: Narrative & Personal Details Grid */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
              <div className="flex flex-col">
                <h4 className="text-lg md:text-xl font-bold text-neutral-900 dark:text-white mb-4 flex items-center border-b border-neutral-200 dark:border-neutral-800 pb-4">
                  Who Am I
                </h4>
                <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
                  Saya adalah Muh. Haikal, seorang pelajar yang sedang mempelajari basic pengembangan website dan estetika desain visual. Saat ini saya sedang menjalani PKL dan mempelajari bagaimana sebuah ide dapat bertransformasi menjadi karya digital yang fungsional dan rapi.
                </p>
              </div>
              <div className="flex flex-col">
                <h4 className="text-lg md:text-xl font-bold text-neutral-900 dark:text-white mb-4 flex items-center border-b border-neutral-200 dark:border-neutral-800 pb-4">
                  My Approach
                </h4>
                <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
                  Saya berkomitmen untuk merancang dan membangun sesuatu dari nol: memahami kebutuhan nyata, menyusun struktur data, merancang tampilan antarmuka, hingga memoles interaksi mikro sampai aplikasi terasa nyaman digunakan.
                </p>
              </div>
            </div>

            <div className="mt-16 md:mt-20">
              <h4 className="text-lg md:text-xl font-bold text-neutral-900 dark:text-white mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-4 border-l-4 border-l-neutral-900 dark:border-l-white pl-4">
                Personal Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10">
                <div className="flex flex-col p-2 -m-2 rounded-xl transition-colors duration-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/40">
                  <span className="text-xs uppercase tracking-widest font-bold text-neutral-500 dark:text-neutral-400 mb-1">Name</span>
                  <span className="text-base font-semibold text-neutral-900 dark:text-white">Muh. Haikal Al Qadrizi</span>
                </div>
                <div className="flex flex-col p-2 -m-2 rounded-xl transition-colors duration-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/40">
                  <span className="text-xs uppercase tracking-widest font-bold text-neutral-500 dark:text-neutral-400 mb-1">Role</span>
                  <span className="text-base font-semibold text-neutral-900 dark:text-white">RPL Student</span>
                </div>
                <div className="flex flex-col p-2 -m-2 rounded-xl transition-colors duration-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/40">
                  <span className="text-xs uppercase tracking-widest font-bold text-neutral-500 dark:text-neutral-400 mb-1">Status</span>
                  <span className="text-base font-semibold text-neutral-900 dark:text-white">Pelajar / Siswa smk</span>
                </div>
                <div className="flex flex-col p-2 -m-2 rounded-xl transition-colors duration-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/40">
                  <span className="text-xs uppercase tracking-widest font-bold text-neutral-500 dark:text-neutral-400 mb-1">Focus</span>
                  <span className="text-base font-semibold text-neutral-900 dark:text-white">Web Development &amp; UI</span>
                </div>
                <div className="flex flex-col p-2 -m-2 rounded-xl transition-colors duration-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/40">
                  <span className="text-xs uppercase tracking-widest font-bold text-neutral-500 dark:text-neutral-400 mb-1">Email</span>
                  <a
                    href="mailto:mlbbus0208@gmail.com"
                    className="text-base font-semibold text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors underline decoration-neutral-400 dark:decoration-neutral-600 underline-offset-4"
                  >
                    mlbbus0208@gmail.com
                  </a>
                </div>
                <div className="flex flex-col p-2 -m-2 rounded-xl transition-colors duration-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/40">
                  <span className="text-xs uppercase tracking-widest font-bold text-neutral-500 dark:text-neutral-400 mb-1">Main Stack</span>
                  <span className="text-base font-semibold text-neutral-900 dark:text-white">Next.js &amp; TypeScript</span>
                </div>
              </div>
            </div>
          </div>
        </BlurReveal>

        {/* 3. SCROLL VELOCITY BANNER */}
        <div className="mt-24 md:mt-32 pb-6 border-t border-neutral-200 dark:border-neutral-800/80 pt-10 overflow-hidden">
          <ScrollVelocity
            texts={["Hello I'm Haikal", "RPL Student"]}
            velocity={70}
            className="shrink font-black tracking-tighter text-neutral-400 dark:text-neutral-500 opacity-60 select-none hover:opacity-100 transition-opacity"
            numCopies={6}
            damping={50}
            stiffness={400}
          />
        </div>
      </section>

      {/* 4. CAREER PATH / WORK EXPERIENCE */}
      <section
        id="experience"
        className="w-full max-w-7xl mx-auto py-24 md:py-32 cursor-default bg-background relative border-t border-text-secondary/10"
      >
        <BlurReveal className="max-w-7xl mx-auto px-6 md:px-12 mb-12 md:mb-16 w-full text-left">
          <h2 className="text-sm font-bold tracking-[0.2em] text-text-secondary uppercase mb-4">Career Path</h2>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter">Work Experience</h3>
        </BlurReveal>

        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <ScrollStack
            useWindowScroll={true}
            itemDistance={50}
            itemStackDistance={24}
            itemScale={0.03}
            baseScale={0.92}
            stackPosition="25%"
            scaleEndPosition="12%"
          >
            {experiences.map((exp, idx) => (
              <ScrollStackItem key={exp.title}>
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-text-secondary/15">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-text-primary text-background flex items-center justify-center font-mono text-xs font-bold">
                          0{idx + 1}
                        </span>
                        <span className="text-xs sm:text-sm font-bold tracking-widest text-text-secondary uppercase">
                          {exp.period}
                        </span>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-text-secondary/20 bg-thirdary/60 text-text-primary">
                        {exp.place}
                      </span>
                    </div>

                    <h4 className="text-2xl sm:text-3xl lg:text-4xl font-black text-text-primary tracking-tight mb-4">
                      {exp.title}
                    </h4>

                    <p className="text-sm sm:text-base text-text-secondary font-medium leading-relaxed max-w-3xl mb-6">
                      {exp.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-text-secondary/10 flex flex-wrap gap-2">
                    {exp.tools.map((tool) => (
                      <span
                        key={tool}
                        className="text-xs font-bold bg-thirdary/80 text-text-primary px-3.5 py-1.5 rounded-xl border border-text-secondary/15 uppercase tracking-wider shadow-sm hover:border-text-primary/50 transition-colors"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </div>
      </section>

      {/* 5. TECH STACK */}
      <section
        id="techstack"
        className="w-full max-w-7xl mx-auto py-24 md:py-32 cursor-default bg-background relative border-t border-text-secondary/10 overflow-hidden"
      >
        <BlurReveal className="max-w-7xl mx-auto px-6 md:px-12 mb-16 md:mb-24 w-full text-left">
          <h2 className="text-sm font-bold tracking-[0.2em] text-text-secondary uppercase mb-4">Skills &amp; Tools</h2>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter">My Tech Stack</h3>
        </BlurReveal>

        <BlurReveal delay={0.15} className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-16">
          {skillGroups.map((group) => (
            <div key={group.title} className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
              <div className="md:w-1/3">
                <h4 className="text-2xl font-black text-text-primary tracking-tight mb-2">{group.title}</h4>
                <p className="text-text-secondary font-medium text-sm">{group.note}</p>
              </div>
              <div className="md:w-2/3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
                {group.items.map((item) => (
                  <div
                    key={item}
                    className="group flex flex-col items-center justify-center p-6 bg-thirdary/20 hover:bg-thirdary/50 border border-text-secondary/10 hover:border-text-primary/50 rounded-2xl transition-all duration-300 hover:-translate-y-2 h-full shadow-sm cursor-default"
                  >
                    <div className="w-12 h-12 mb-4 transition-transform duration-300 group-hover:scale-110 flex items-center justify-center pointer-events-none">
                      <TechIcon name={item} className="w-10 h-10" />
                    </div>
                    <span className="text-sm font-bold text-text-primary text-center">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </BlurReveal>
      </section>

      {/* 6. PORTFOLIO / SELECTED WORKS */}
      <section
        id="projects"
        className="w-full max-w-7xl mx-auto py-24 md:py-32 cursor-default bg-background relative border-t border-text-secondary/10"
      >
        {/* Section Header */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12 md:mb-16 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
          <BlurReveal>
            <h2 className="text-sm font-bold tracking-[0.2em] text-text-secondary uppercase mb-4">Portfolio</h2>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter">
              Selected Works
            </h3>
            <p className="mt-3 text-sm md:text-base text-text-secondary max-w-xl font-medium leading-relaxed">
              Koleksi karya eksplorasi visual, identitas artistik, dan eksperimen desain monokrom. Arahkan kursor atau sentuh untuk melihat detailnya.
            </p>
          </BlurReveal>

          <BlurReveal delay={0.1}>
            <Link
              href="/collection"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-text-secondary/20 hover:border-text-primary text-text-primary hover:bg-text-primary hover:text-background text-xs font-bold uppercase tracking-wider transition-all duration-300 w-fit shadow-sm hover:shadow-md group"
            >
              <span>Explore Collection</span>
              <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </BlurReveal>
        </div>

        {/* Desktop: Accordion Gallery */}
        <BlurReveal delay={0.2} className="hidden md:block max-w-7xl mx-auto px-6 md:px-12">
          <AccordionGallery
            items={projects.map((p) => ({
              image: p.image,
              label: `${p.number} — ${p.name}`,
              link: '/collection',
              alt: p.name,
              objectFit: p.number === '02' ? 'contain' : 'cover',
            }))}
            defaultIndex={1}
            expandRatio={0.52}
            trigger="hover"
            accentColor="#ffffff"
            overlayColor="#0a0a0a"
            textColor="#ffffff"
            grayscale={false}
            showLabels={true}
            duration={0.65}
            ease="power3.out"
            parallax={0.4}
            tilt={6}
            stagger={0.06}
            height={480}
            gap={14}
            radius={24}
            orientation="horizontal"
          />
        </BlurReveal>

        {/* Mobile: draggable Stack card */}
        <BlurReveal delay={0.2} className="md:hidden max-w-7xl mx-auto px-6">
          {/* hint text */}
          <p className="text-center text-xs text-text-secondary/60 mb-5 tracking-wide">
            Geser kartu untuk melihat karya lainnya
          </p>
          <div className="mx-auto" style={{ width: 260, height: 320 }}>
            <Stack
              randomRotation={false}
              sensitivity={120}
              sendToBackOnClick={true}
              animationConfig={{ stiffness: 280, damping: 22 }}
              autoplay={true}
              autoplayDelay={3500}
              pauseOnHover={false}
              cards={projects.map((p, i) => (
                <div key={i} className="relative w-full h-full overflow-hidden rounded-2xl bg-neutral-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.name}
                    className={`w-full h-full pointer-events-none ${
                      p.number === '02' ? 'object-contain p-4 drop-shadow-xl' : 'object-cover'
                    }`}
                  />
                  {/* label overlay */}
                  <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-[10px] font-bold tracking-widest text-white/60 uppercase">{p.number}</p>
                    <p className="text-sm font-bold text-white tracking-tight">{p.name}</p>
                  </div>
                </div>
              ))}
            />
          </div>
          <div className="mt-8 flex justify-center">
            <Link
              href="/collection"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-text-secondary/20 text-text-primary text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:bg-text-primary hover:text-background group"
            >
              <span>Lihat Semua Karya</span>
              <ArrowUpRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </BlurReveal>
      </section>

      {/* 7. JOURNAL / ARTICLES */}
      <section className="w-full max-w-7xl mx-auto py-24 md:py-32 cursor-default bg-background relative border-t border-text-secondary/10">
        {/* Section Header */}
        <BlurReveal className="max-w-7xl mx-auto px-6 md:px-12 mb-12 md:mb-16 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-text-secondary/20 bg-thirdary/40 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-text-secondary mb-4">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Journal &amp; Insights</span>
            </div>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter">
              Latest Articles
            </h3>
            <p className="mt-3 text-sm md:text-base text-text-secondary max-w-xl font-medium leading-relaxed">
              Catatan seputar proses pembuatan software, pemecahan masalah teknis, serta ide dan eksplorasi yang sedang saya jalani.
            </p>
          </div>

          <Link
            href="/artikel"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-text-secondary/20 hover:border-text-primary text-text-primary hover:bg-text-primary hover:text-background text-xs font-bold uppercase tracking-wider transition-all duration-300 w-fit shadow-sm hover:shadow-md group"
          >
            <span>Semua Artikel</span>
            <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </BlurReveal>

        {/* Articles Content */}
        {latestArticles.length === 1 ? (
          /* MINIMALIST FEATURED ARTICLE CARD (WITHOUT CLUTTERED COMPANION BOX) */
          <BlurReveal delay={0.15} className="max-w-7xl mx-auto px-6 md:px-12">
            <Link
              href={`/artikel/${latestArticles[0].id}`}
              className="group relative flex flex-col lg:flex-row overflow-hidden rounded-3xl border border-text-secondary/20 hover:border-text-primary bg-background shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
            >
              {/* Image Section */}
              <div className="relative aspect-[16/10] lg:aspect-auto lg:w-5/12 overflow-hidden bg-text-secondary/5 border-b lg:border-b-0 lg:border-r border-text-secondary/10 min-h-[260px] lg:min-h-[340px]">
                {latestArticles[0].thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={latestArticles[0].thumbnail}
                    alt={latestArticles[0].title}
                    className="object-cover w-full h-full transition-all duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-thirdary/50 text-text-secondary text-sm font-semibold tracking-wider uppercase">
                    Haikal Journal
                  </div>
                )}

                <div className="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur-md px-3 py-1 rounded-full border border-text-secondary/20 text-[10px] font-bold uppercase tracking-widest text-text-primary shadow-md flex items-center gap-1.5">
                  <span></span> Featured Story
                </div>

                <div className="absolute bottom-4 left-4 z-10 bg-background/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-text-secondary/20 text-[10px] font-semibold text-text-secondary shadow-md">
                  ⏱️ {getReadingTime(latestArticles[0].content)}
                </div>
              </div>

              {/* Info Section */}
              <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between lg:w-7/12">
                <div>
                  <div className="flex items-center justify-between text-xs text-text-secondary mb-4">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-text-secondary">
                      #01 • Tech &amp; Learning
                    </span>
                    <time className="font-medium">
                      {new Date(latestArticles[0].created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </time>
                  </div>

                  <h4 className="text-2xl sm:text-3xl lg:text-4xl font-black text-text-primary tracking-tight leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-text-primary group-hover:to-text-secondary transition-all duration-500 mb-4 line-clamp-2">
                    {latestArticles[0].title}
                  </h4>

                  <p className="text-sm sm:text-base text-text-secondary font-medium leading-relaxed mb-8 line-clamp-3">
                    {getExcerpt(latestArticles[0].content, 220)}
                  </p>
                </div>

                <div className="pt-5 border-t border-text-secondary/10 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs font-semibold text-text-secondary">
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {latestArticles[0].view_count} views
                    </span>
                    {latestArticles[0]._count?.reactions > 0 && (
                      <span className="flex items-center gap-1">
                        ❤️ {latestArticles[0]._count.reactions}
                      </span>
                    )}
                  </div>

                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-primary group-hover:translate-x-1.5 transition-transform duration-300">
                    Baca Artikel <span>→</span>
                  </span>
                </div>
              </div>
            </Link>
          </BlurReveal>
        ) : latestArticles.length > 1 ? (
          /* GRID LAYOUT FOR MULTIPLE ARTICLES */
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestArticles.map((article, idx) => (
              <BlurReveal key={article.id} delay={idx * 0.1} className="h-full">
                <Link
                  href={`/artikel/${article.id}`}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-text-secondary/20 hover:border-text-primary bg-background shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5 h-full"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-text-secondary/5 border-b border-text-secondary/10">
                    {article.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={article.thumbnail}
                        alt={article.title}
                        className="object-cover w-full h-full transition-all duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-thirdary/50 text-text-secondary text-sm font-semibold tracking-wider uppercase">
                        Haikal Journal
                      </div>
                    )}

                    <div className="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-text-secondary/20 text-[10px] font-mono font-bold tracking-wider text-text-primary shadow-sm">
                      #{String(idx + 1).padStart(2, '0')}
                    </div>

                    <div className="absolute top-4 right-4 z-10 bg-background/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-text-secondary/20 text-[10px] font-semibold text-text-secondary shadow-sm">
                      ⏱️ {getReadingTime(article.content)}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6 sm:p-8 flex flex-col flex-grow justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-text-secondary mb-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary/80">
                          Article
                        </span>
                        <time className="font-medium">
                          {new Date(article.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </time>
                      </div>

                      <h4 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-text-primary group-hover:to-text-secondary transition-all duration-500 mb-3 line-clamp-2">
                        {article.title}
                      </h4>

                      <p className="text-sm text-text-secondary font-medium leading-relaxed mb-6 line-clamp-3">
                        {getExcerpt(article.content, 140)}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-text-secondary/10 flex items-center justify-between mt-auto">
                      <span className="flex items-center gap-1.5 text-xs text-text-secondary font-medium">
                        👁️ {article.view_count} views
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-text-primary group-hover:translate-x-1 transition-transform">
                        Baca <span>→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </BlurReveal>
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <BlurReveal delay={0.15} className="max-w-7xl mx-auto px-6 md:px-12 py-16 text-center border border-dashed border-text-secondary/20 rounded-3xl bg-thirdary/10">
            <p className="text-text-secondary text-base font-medium">
              Belum ada artikel yang dipublikasikan. Silakan cek kembali nanti!
            </p>
          </BlurReveal>
        )}
      </section>

      {/* 8. CONTACT SECTION */}
      <BlurReveal>
        <ContactSection />
      </BlurReveal>
    </div>
  )
}
