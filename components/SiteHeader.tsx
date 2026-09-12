'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
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
  const [activeSection, setActiveSection] = useState('home')

  // Sembunyikan navbar di halaman auth dan dashboard
  if (pathname === '/login' || pathname === '/register' || pathname.startsWith('/dashboard')) {
    return null
  }

  const mainLinks = [
    { href: '/#about', label: 'About', sectionId: 'about' },
    { href: '/#experience', label: 'Experience', sectionId: 'experience' },
    { href: '/#projects', label: 'Projects', sectionId: 'projects' },
    { href: '/#contact', label: 'Contacts', sectionId: 'contact' },
    { href: '/artikel', label: 'Artikel', sectionId: null },
  ]

  async function handleLogout() {
    await supabase.auth.signOut()
    await fetch('/auth/signout', { method: 'POST', headers: { Accept: 'application/json' } })
    setMobileOpen(false)
    router.replace('/')
    router.refresh()
  }

  return (
    <NavbarWithScrollspy
      mainLinks={mainLinks}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      pathname={pathname}
      mobileOpen={mobileOpen}
      setMobileOpen={setMobileOpen}
      isLoggedIn={isLoggedIn}
      isOwner={isOwner}
      handleLogout={handleLogout}
    />
  )
}

function NavbarWithScrollspy({
  mainLinks,
  activeSection,
  setActiveSection,
  pathname,
  mobileOpen,
  setMobileOpen,
  isLoggedIn,
  isOwner,
  handleLogout,
}: {
  mainLinks: { href: string; label: string; sectionId: string | null }[]
  activeSection: string
  setActiveSection: (s: string) => void
  pathname: string
  mobileOpen: boolean
  setMobileOpen: (v: boolean) => void
  isLoggedIn: boolean
  isOwner: boolean
  handleLogout: () => void
}) {
  const isHomePage = pathname === '/'

  // Scrollspy: track which section is visible
  useEffect(() => {
    if (!isHomePage) return

    const sectionIds = ['home', 'about', 'experience', 'projects', 'contact']
    const observers: IntersectionObserver[] = []

    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(callback, {
        rootMargin: '-40% 0px -55% 0px',
        threshold: 0,
      })
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((obs) => obs.disconnect())
  }, [isHomePage, setActiveSection])

  function isLinkActive(link: { href: string; sectionId: string | null }) {
    if (!link.sectionId) {
      // Non-hash links: match by pathname
      return pathname === link.href
    }
    // Hash links: active by scrollspy on homepage, otherwise inactive
    return isHomePage && activeSection === link.sectionId
  }

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    // For hash links on the same page — smooth scroll without full navigation
    if (href.startsWith('/#') && isHomePage) {
      e.preventDefault()
      const id = href.slice(2)
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      setMobileOpen(false)
    }
  }

  return (
    <div className="fixed top-3.5 sm:top-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <header className="pointer-events-auto relative w-full max-w-3xl rounded-full border border-text-secondary/15 bg-background/80 dark:bg-[#111111]/80 backdrop-blur-md shadow-lg dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] px-6 sm:px-8 py-3.5 transition-all duration-200">
        <div className="flex items-center justify-between">

          {/* Left: Brand */}
          <Link
            href="/"
            onClick={(e) => {
              if (isHomePage) {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
            }}
            className="text-lg sm:text-xl font-black tracking-tight text-text-primary hover:opacity-80 transition-opacity select-none"
          >
            HAiKAL<span className="text-text-secondary">.</span>
          </Link>

          {/* Center: Desktop nav links */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-10 text-sm lg:text-base">
            {mainLinks.map((link) => {
              const active = isLinkActive(link)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`font-medium transition-all duration-200 relative ${
                    active
                      ? 'text-text-primary font-bold'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Right: ThemeToggle + hamburger */}
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
              <nav className="absolute right-0 top-full mt-3 w-52 rounded-2xl border border-text-secondary/15 bg-background/95 dark:bg-[#111111]/95 backdrop-blur-md shadow-xl flex flex-col gap-0.5 p-2.5 z-50">
                {/* Mobile Section Links (hidden on desktop where they are in navbar) */}
                <div className="md:hidden">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-text-secondary">
                    Navigasi
                  </div>
                  {mainLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={(e) => {
                        handleNavClick(e, link.href)
                        setMobileOpen(false)
                      }}
                      className="px-3 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-thirdary transition-colors flex items-center justify-between"
                    >
                      <span>{link.label}</span>
                      <span className="text-xs opacity-50">→</span>
                    </Link>
                  ))}
                  <div className="my-1.5 border-t border-text-secondary/10" />
                </div>

                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-text-secondary">
                  Account
                </div>
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
                    className="px-3 py-2 rounded-xl text-left text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-thirdary transition-colors cursor-pointer"
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
