'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [requiresConfirmation, setRequiresConfirmation] = useState(false)

  async function handleRegister(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Jika Supabase mengembalikan session (Confirm email nonaktif di dashboard)
    if (data.session) {
      await fetch('/api/auth/sync-user', { method: 'POST' })
      router.replace('/')
      router.refresh()
      return
    }

    // Jika Confirm email masih aktif di Supabase
    setLoading(false)
    setRequiresConfirmation(true)
  }

  if (requiresConfirmation) {
    return (
      <div className="login-page-shell min-h-screen flex items-center justify-center px-6 py-16 bg-background text-text-primary relative overflow-hidden transition-colors duration-200">
        <div className="login-page-card w-full max-w-md bg-thirdary/60 dark:bg-thirdary/80 border border-text-secondary/15 rounded-2xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-xl font-bold text-emerald-500">
            ✓
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Cek email kamu</h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            Link konfirmasi sudah dikirim ke{' '}
            <span className="font-semibold text-text-primary">{email}</span>. Klik link tersebut untuk
            mengaktifkan akun.
          </p>
          <Link href="/login" className="inline-block text-sm font-semibold text-text-primary underline underline-offset-4 hover:opacity-80">
            Kembali ke Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="login-page-shell min-h-screen flex items-center justify-center px-6 py-16 bg-background text-text-primary relative overflow-hidden transition-colors duration-200">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-text-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <Link
        href="/"
        className="absolute top-8 left-6 md:left-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-text-primary transition z-20"
      >
        <span>←</span> Kembali ke beranda
      </Link>

      <div className="login-page-card w-full max-w-md bg-thirdary/60 dark:bg-thirdary/80 border border-text-secondary/15 rounded-2xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-xl font-bold tracking-tight text-text-primary mb-2">
            HAiKAL<span className="text-text-secondary">.</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Daftar Akun</h1>
          <p className="text-sm text-text-secondary mt-1">Bergabung untuk berkomentar dan berinteraksi</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-secondary">Nama Lengkap</label>
            <input
              type="text"
              placeholder="Haikal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border border-text-secondary/20 bg-background px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-text-primary focus:ring-1 focus:ring-text-primary transition"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-secondary">Email</label>
            <input
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-text-secondary/20 bg-background px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-text-primary focus:ring-1 focus:ring-text-primary transition"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-secondary">Password</label>
            <input
              type="password"
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-xl border border-text-secondary/20 bg-background px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-text-primary focus:ring-1 focus:ring-text-primary transition"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs font-medium text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-button-hero hover:bg-button-hero-hover text-background dark:text-foreground py-3.5 text-sm font-semibold tracking-wide transition disabled:opacity-50 shadow-md"
          >
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-text-secondary">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-semibold text-text-primary underline underline-offset-4 hover:opacity-80">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
