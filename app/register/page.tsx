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
      <div className="flex min-h-screen items-center justify-center px-4 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <div className="max-w-sm w-full text-center space-y-4 bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
            ✓
          </div>
          <h1 className="text-xl font-bold">Cek email kamu</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Link konfirmasi sudah dikirim ke <span className="font-medium text-zinc-900 dark:text-zinc-100">{email}</span>. Klik link tersebut untuk mengaktifkan akun.
          </p>
          <Link
            href="/login"
            className="inline-block mt-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Kembali ke Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="w-full max-w-sm space-y-6 bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Daftar Akun</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Buat akun baru untuk Project Haikal</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Nama Lengkap</label>
            <input
              type="text"
              placeholder="Haikal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Email</label>
            <input
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Password</label>
            <input
              type="password"
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
            />
          </div>

          {error && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/40 p-2.5 rounded-lg">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 text-sm font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <p className="text-xs text-center text-zinc-500 dark:text-zinc-400">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-semibold text-zinc-900 dark:text-zinc-100 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
