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
      router.push('/')
      router.refresh()
      return
    }

    // Jika Confirm email masih aktif di Supabase
    setLoading(false)
    setRequiresConfirmation(true)
  }

  if (requiresConfirmation) {
    return (
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sage/15 text-xl font-bold text-sage">
            ✓
          </div>
          <h1 className="font-serif text-2xl">Cek email kamu</h1>
          <p className="text-sm text-foreground/60">
            Link konfirmasi sudah dikirim ke{' '}
            <span className="font-medium text-foreground">{email}</span>. Klik link tersebut untuk
            mengaktifkan akun.
          </p>
          <Link href="/login" className="inline-block text-sm font-semibold text-clay hover:underline">
            Kembali ke Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="font-serif text-3xl">Daftar Akun</h1>
          <p className="text-sm text-foreground/60">Buat akun baru</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground/60">Nama Lengkap</label>
            <input
              type="text"
              placeholder="Haikal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-sm border border-line bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-clay"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground/60">Email</label>
            <input
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-sm border border-line bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-clay"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground/60">Password</label>
            <input
              type="password"
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-sm border border-line bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-clay"
            />
          </div>

          {error && <p className="rounded-sm bg-clay/10 p-2.5 text-xs text-clay">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm bg-clay px-4 py-2.5 text-sm font-semibold text-background transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <p className="text-center text-xs text-foreground/60">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-semibold text-clay hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
