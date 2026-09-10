'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from '@/components/ThemeToggle'
import { useState } from 'react'

export default function DashboardNav() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = [
    { href: '/dashboard', label: 'Overview', exact: true },
    { href: '/dashboard/artikel/tambah', label: 'Tulis Artikel', exact: false },
    { href: '/dashboard/komunitas', label: 'Komunitas', exact: false },
    { href: '/artikel', label: 'Lihat Web', exact: false, external: true },
  ]

  const isActive = (item: (typeof navItems)[0]) => {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-text-secondary/10 bg-background/80 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Brand & Badge */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-text-primary hover:opacity-80 transition-opacity"
          >
            HAiKAL<span className="text-text-secondary">.</span>
          </Link>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-thirdary border border-text-secondary/15 text-text-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Workspace
          </span>
        </div>

        {/* Desktop Nav Pills */}
        <nav className="hidden md:flex items-center gap-1 bg-thirdary/60 border border-text-secondary/15 p-1 rounded-full text-xs">
          {navItems.map((item) => {
            const active = isActive(item)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-1.5 rounded-full font-medium transition-all duration-150 ${
                  active
                    ? 'bg-text-primary text-background shadow-xs'
                    : 'text-text-secondary hover:text-text-primary hover:bg-thirdary'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden sm:inline-flex text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            ← Beranda
          </Link>
          <ThemeToggle />
          {/* Mobile 2-lines button */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex md:hidden relative w-9 h-9 rounded-xl flex-col items-center justify-center gap-1.5 hover:bg-thirdary border border-text-secondary/15 transition-all duration-200 cursor-pointer focus:outline-none"
            aria-label={menuOpen ? 'Tutup navigasi' : 'Buka navigasi'}
          >
            <span
              className={`w-4 h-[2px] bg-text-primary rounded-full transition-all duration-300 ease-out origin-center ${
                menuOpen ? 'rotate-45 translate-y-[3.5px]' : ''
              }`}
            />
            <span
              className={`w-4 h-[2px] bg-text-primary rounded-full transition-all duration-300 ease-out origin-center ${
                menuOpen ? '-rotate-45 -translate-y-[3.5px]' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-text-secondary/10 bg-background/95 backdrop-blur-md px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-thirdary text-text-primary font-semibold'
                    : 'text-text-secondary hover:text-text-primary hover:bg-thirdary/60'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-thirdary/60 transition-colors"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      )}
    </header>
  )
}
