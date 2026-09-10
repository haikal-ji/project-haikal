import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Halaman Tidak Ditemukan | Haikal',
}

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-73px)] flex-col items-start justify-center bg-white dark:bg-[#090909] px-6 py-24 md:px-20">
      <p className="section-index mb-6">404 / tidak ditemukan</p>
      <h1
        className="font-serif leading-[0.88] tracking-[-0.05em] text-neutral-900 dark:text-white"
        style={{ fontSize: 'clamp(5rem, 18vw, 14rem)' }}
      >
        Halaman ini tidak ada.
      </h1>
      <p className="mt-8 max-w-sm text-sm leading-6 text-neutral-500 dark:text-neutral-400">
        Halaman yang kamu cari mungkin sudah dipindahkan, dihapus, atau memang tidak pernah ada. Kembali ke beranda dan mulai dari sana.
      </p>
      <Link href="/" className="editorial-link mt-10 inline-flex items-center gap-3">
        ← Kembali ke beranda
      </Link>
    </main>
  )
}
