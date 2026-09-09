'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import ThemeToggle from '@/components/ThemeToggle'

export default function SiteHeader({
  isLoggedIn,
  isOwner,
}: {
  isLoggedIn: boolean
  isOwner: boolean
}) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [menuOpen, setMenuOpen] = useState(false)

  // Sembunyikan navbar di halaman auth biar fokus, kayak web personal pada umumnya
  if (pathname === '/login' || pathname === '/register' || pathname.startsWith('/dashboard')) {
    return null
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const links = [
    { href: '/about', label: 'About' },
    { href: '/artikel', label: 'Artikel' },
    { href: '/collection', label: 'Collection' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header className="site-header">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        <Link href="/" className="wordmark" onClick={() => setMenuOpen(false)}>
          HAiKAL<span>.</span>
        </Link>
        <div className="hidden items-center gap-8 text-xs uppercase tracking-[0.14em] md:flex">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive ? 'text-clay font-semibold' : ''}`}
              >
                {link.label}
              </Link>
            )
          })}
          {isOwner && (
            <Link
              href="/dashboard"
              className={`nav-link ${pathname.startsWith('/dashboard') ? 'text-clay font-semibold' : ''}`}
            >
              Dashboard
            </Link>
          )}
          {isLoggedIn ? (
            <>
              <Link
                href="/profile"
                className={`nav-link ${pathname === '/profile' ? 'text-clay font-semibold' : ''}`}
              >
                Profil
              </Link>
              <button onClick={handleLogout} className="nav-link text-foreground/50">
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className={`nav-link ${pathname === '/login' ? 'text-clay font-semibold' : ''}`}
            >
              Login
            </Link>
          )}
          <ThemeToggle />
        </div>
        <button
          type="button"
          className="menu-button md:hidden"
          aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span /><span />
        </button>
      </nav>
      {menuOpen && (
        <div className="mobile-menu md:hidden">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={isActive ? 'text-clay font-semibold' : ''}
              >
                {link.label}
              </Link>
            )
          })}
          {isOwner && (
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className={pathname.startsWith('/dashboard') ? 'text-clay font-semibold' : ''}
            >
              Dashboard
            </Link>
          )}
          {isLoggedIn ? (
            <>
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className={pathname === '/profile' ? 'text-clay font-semibold' : ''}
              >
                Profil
              </Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className={pathname === '/login' ? 'text-clay font-semibold' : ''}
            >
              Login
            </Link>
          )}
          <ThemeToggle />
        </div>
      )}
    </header>
  )
}
