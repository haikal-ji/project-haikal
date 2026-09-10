import type { Metadata } from 'next'
import ContactSection from '@/components/ContactSection'

export const metadata: Metadata = {
  title: 'Contact | Haikal',
  description: 'Hubungi Haikal untuk kolaborasi, diskusi proyek, atau sekadar bertukar ide seputar pengembangan web.',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <ContactSection isStandalone={true} />
    </main>
  )
}
