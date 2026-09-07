import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Contact | Haikal',
  description: 'Terbuka untuk kolaborasi, percakapan, atau sekadar bertukar ide.',
}

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children
}
