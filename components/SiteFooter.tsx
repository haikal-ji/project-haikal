'use client'

import { usePathname } from 'next/navigation'
import LogoLoop, { type LogoItem } from '@/components/LogoLoop'
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiPrisma,
  SiSupabase,
  SiPostgresql,
  SiFigma,
  SiDocker,
  SiGit,
  SiVercel,
} from 'react-icons/si'

const techLogos: LogoItem[] = [
  {
    title: 'NEXT.JS',
    node: (
      <span className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors duration-200">
        <SiNextdotjs className="w-5 h-5 text-current" />
        <span className="text-xs font-semibold tracking-wider uppercase">Next.js</span>
      </span>
    ),
  },
  {
    title: 'REACT',
    node: (
      <span className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors duration-200">
        <SiReact className="w-5 h-5 text-current" />
        <span className="text-xs font-semibold tracking-wider uppercase">React</span>
      </span>
    ),
  },
  {
    title: 'TYPESCRIPT',
    node: (
      <span className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors duration-200">
        <SiTypescript className="w-5 h-5 text-current" />
        <span className="text-xs font-semibold tracking-wider uppercase">TypeScript</span>
      </span>
    ),
  },
  {
    title: 'TAILWIND CSS',
    node: (
      <span className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors duration-200">
        <SiTailwindcss className="w-5 h-5 text-current" />
        <span className="text-xs font-semibold tracking-wider uppercase">Tailwind CSS</span>
      </span>
    ),
  },
  {
    title: 'PRISMA ORM',
    node: (
      <span className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors duration-200">
        <SiPrisma className="w-5 h-5 text-current" />
        <span className="text-xs font-semibold tracking-wider uppercase">Prisma ORM</span>
      </span>
    ),
  },
  {
    title: 'SUPABASE',
    node: (
      <span className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors duration-200">
        <SiSupabase className="w-5 h-5 text-current" />
        <span className="text-xs font-semibold tracking-wider uppercase">Supabase</span>
      </span>
    ),
  },
  {
    title: 'POSTGRESQL',
    node: (
      <span className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors duration-200">
        <SiPostgresql className="w-5 h-5 text-current" />
        <span className="text-xs font-semibold tracking-wider uppercase">PostgreSQL</span>
      </span>
    ),
  },
  {
    title: 'FIGMA',
    node: (
      <span className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors duration-200">
        <SiFigma className="w-5 h-5 text-current" />
        <span className="text-xs font-semibold tracking-wider uppercase">Figma</span>
      </span>
    ),
  },
  {
    title: 'DOCKER',
    node: (
      <span className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors duration-200">
        <SiDocker className="w-5 h-5 text-current" />
        <span className="text-xs font-semibold tracking-wider uppercase">Docker</span>
      </span>
    ),
  },
  {
    title: 'GIT',
    node: (
      <span className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors duration-200">
        <SiGit className="w-5 h-5 text-current" />
        <span className="text-xs font-semibold tracking-wider uppercase">Git</span>
      </span>
    ),
  },
  {
    title: 'VERCEL',
    node: (
      <span className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors duration-200">
        <SiVercel className="w-5 h-5 text-current" />
        <span className="text-xs font-semibold tracking-wider uppercase">Vercel</span>
      </span>
    ),
  },
]

export default function SiteFooter() {
  const pathname = usePathname()

  if (pathname.startsWith('/dashboard')) return null

  return (
    <footer className="border-t border-text-secondary/10 bg-background text-text-primary transition-colors duration-200">
      {/* 1. Animated Logo Loop Divider between page and footer */}
      <div className="border-b border-text-secondary/10 py-5 overflow-hidden opacity-60 hover:opacity-100 transition-opacity duration-300">
        <LogoLoop
          logos={techLogos}
          speed={65}
          direction="left"
          logoHeight={20}
          gap={56}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          ariaLabel="Technologies and tools"
        />
      </div>

      {/* 2. Main Footer Content (RyHar layout with GMAIL) */}
      <div className="mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 max-w-7xl px-6 py-8 md:px-12">
        <div className="flex flex-col gap-1 text-center sm:text-left text-xs sm:text-sm text-text-secondary">
          <p>© {new Date().getFullYear()} Haikal. All rights reserved.</p>
          <p className="text-xs text-text-secondary/70">Built with Next.js &amp; Tailwind CSS</p>
        </div>

        <div className="flex items-center gap-6 sm:gap-8 text-xs font-bold uppercase tracking-widest">
          <a
            href="https://github.com/haikal-ji"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-text-primary transition-colors duration-200"
          >
            GITHUB
          </a>
          <a
            href="mailto:mlbbus0208@gmail.com"
            className="text-text-secondary hover:text-text-primary transition-colors duration-200"
          >
            GMAIL
          </a>
          <a
            href="https://instagram.com/__02ekall"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-text-primary transition-colors duration-200"
          >
            INSTAGRAM
          </a>
        </div>
      </div>
    </footer>
  )
}
