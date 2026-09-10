'use client'

import { usePathname } from 'next/navigation'

export default function ScrollBlur() {
  const pathname = usePathname()

  // Sembunyikan blur overlay di halaman auth dan dashboard
  if (pathname === '/login' || pathname === '/register' || pathname.startsWith('/dashboard')) {
    return null
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 right-0 z-40 h-24 sm:h-28 md:h-36 select-none overflow-hidden"
    >
      {/* Progressive Blur Layer 1 (Subtle base) */}
      <div
        className="absolute inset-x-0 top-0 h-full pointer-events-none"
        style={{
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          maskImage: 'linear-gradient(to bottom, black 10%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 10%, transparent 100%)',
        }}
      />
      {/* Progressive Blur Layer 2 (Medium) */}
      <div
        className="absolute inset-x-0 top-0 h-[80%] pointer-events-none"
        style={{
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          maskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)',
        }}
      />
      {/* Progressive Blur Layer 3 (Deep top blur) */}
      <div
        className="absolute inset-x-0 top-0 h-[55%] pointer-events-none"
        style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          maskImage: 'linear-gradient(to bottom, black 35%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 35%, transparent 100%)',
        }}
      />
      {/* Background Gradient Fade (Smooth transition into background) */}
      <div
        className="absolute inset-0 pointer-events-none bg-gradient-to-b from-background via-background/60 to-transparent"
        style={{
          maskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
        }}
      />
    </div>
  )
}
