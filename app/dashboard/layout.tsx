import ThemeToggle from '@/components/ThemeToggle'
import type { ReactNode } from 'react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dashboard-area">
      <div className="dashboard-theme-control">
        <ThemeToggle />
      </div>
      {children}
    </div>
  )
}
