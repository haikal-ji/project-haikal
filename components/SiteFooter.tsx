'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function SiteFooter() {
  const pathname = usePathname()

  if (pathname.startsWith('/dashboard')) return null

  return (
    <footer className="site-footer">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3 md:px-10">
        <div>
          <p className="wordmark wordmark-light">HAiKAL<span>.</span></p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-background/60">
            Membangun website yang rapi, hangat, dan gampang dipakai.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <a
            href="https://github.com/haikal-ji"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            GitHub
          </a>
          <a
            href="https://instagram.com/__02ekall"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Instagram
          </a>
          <Link href="/uses" className="footer-link">Uses / Stack</Link>
          <Link href="/changelog" className="footer-link">Changelog</Link>
        </div>

        <div className="text-sm text-background/60 sm:text-right">
          <p>© {new Date().getFullYear()} Haikal</p>
        </div>
      </div>
    </footer>
  )
}
