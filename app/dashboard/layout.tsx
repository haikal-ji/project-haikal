import DashboardNav from '@/components/DashboardNav'
import type { ReactNode } from 'react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col font-sans transition-colors duration-200 relative overflow-hidden">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-text-secondary/5 blur-[120px] rounded-full"
      />

      <DashboardNav />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
        {children}
      </main>

      <footer className="border-t border-text-secondary/10 py-6 text-center text-xs text-text-secondary">
        <p>© {new Date().getFullYear()} HAiKAL. Dashboard & Content Desk.</p>
      </footer>
    </div>
  )
}
