'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import ThemeToggle from '@/components/ThemeToggle'
import { createClient } from '@/lib/supabase/client'

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
  const [mobileOpen, setMobileOpen] = useState(false)

  // Sembunyikan navbar di halaman auth dan dashboard
  if (pathname === '/login' || pathname === '/register' || pathname.startsWith('/dashboard')) {
    return null
  }

  const mainLinks = [
    { href: '/artikel', label: 'Artikel' },
    { href: '/#about', label: 'About' },
    { href: '/#experience', label: 'Experience' },
    { href: '/#projects', label: 'Projects' },
    { href: '/#contact', label: 'Contacts' },
  ]

  async function handleLogout() {
    await supabase.auth.signOut()
    await fetch('/auth/signout', { method: 'POST', headers: { Accept: 'application/json' } })
    setMobileOpen(false)
    router.replace('/')
    router.refresh()
  }

  return (
    <div className="fixed top-3.5 sm:top-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <header className="pointer-events-auto relative w-full max-w-5xl rounded-full border border-text-secondary/15 bg-background/80 dark:bg-[#111111]/80 backdrop-blur-md shadow-lg dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] px-5 sm:px-7 py-3 transition-all duration-200">
        <div className="flex items-center justify-between">

          {/* Left: Brand */}
          <Link
            href="/"
            className="text-base sm:text-lg font-black tracking-tight text-text-primary hover:opacity-80 transition-opacity select-none"
          >
            HAiKAL<span className="text-text-secondary">.</span>
          </Link>

          {/* Center: Desktop nav links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm">
            {mainLinks.map((link) => {
              const isHash = link.href.includes('#')
              const linkPath = link.href.split('#')[0] || '/'
              const isActive = !isHash && pathname === linkPath
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-text-primary font-bold'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Right: ThemeToggle + hamburger (all screens) */}
          <div className="relative flex items-center gap-2 sm:gap-3">

            <ThemeToggle />

            {/* Hamburger - all screens */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={mobileOpen}
              className="p-2 rounded-full hover:bg-thirdary text-text-primary transition-colors flex flex-col justify-center items-center gap-1.5 focus:outline-none cursor-pointer"
            >
              <span
                className={`w-5 h-[2px] bg-text-primary rounded-full transition-all duration-300 origin-center ${
                  mobileOpen ? 'rotate-45 translate-y-[5px]' : ''
                }`}
              />
              <span
                className={`w-5 h-[2px] bg-text-primary rounded-full transition-all duration-300 origin-center ${
                  mobileOpen ? '-rotate-45 -translate-y-[5px]' : ''
                }`}
              />
            </button>

            {/* Floating dropdown card */}
            {mobileOpen && (
              <nav className="absolute right-0 top-full mt-3 w-44 rounded-2xl border border-text-secondary/15 bg-background/95 dark:bg-[#111111]/95 backdrop-blur-md shadow-xl flex flex-col gap-0.5 p-2 z-50">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-text-secondary">Account</div>
                {isOwner && (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-thirdary transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                {isLoggedIn && (
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-thirdary transition-colors"
                  >
                    Profil
                  </Link>
                )}
                {isLoggedIn ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-xl text-left text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-thirdary transition-colors"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-thirdary transition-colors"
                  >
                    Login
                  </Link>
                )}
              </nav>
            )}
          </div>
        </div>

      </header>
    </div>
  )
}
