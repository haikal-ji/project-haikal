'use client'

import { useState, useActionState, Suspense } from 'react'
import { useFormStatus } from 'react-dom'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import AuthMessage from '@/components/AuthMessage'
import { registerAction } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-button-hero hover:bg-button-hero-hover text-background dark:text-foreground py-3.5 text-sm font-semibold tracking-wide transition disabled:opacity-50 shadow-md cursor-pointer"
    >
      {pending ? 'Memproses...' : 'Daftar'}
    </button>
  )
}

function RegisterForm() {
  const searchParams = useSearchParams()
  const rawNext = searchParams.get('next') || searchParams.get('redirectTo') || '/'
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/'

  const [state, formAction] = useActionState(registerAction, null)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')

  if (state?.requiresConfirmation) {
    return (
      <div className="login-page-shell min-h-screen flex items-center justify-center px-6 py-16 bg-background text-text-primary relative overflow-hidden transition-colors duration-200">
        <div className="login-page-card w-full max-w-md bg-thirdary/60 dark:bg-thirdary/80 border border-text-secondary/15 rounded-2xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-xl font-bold text-emerald-500">
            ✓
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Cek email kamu</h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            Link konfirmasi sudah dikirim ke{' '}
            <span className="font-semibold text-text-primary">{state.email}</span>. Klik link tersebut untuk
            mengaktifkan akun.
          </p>
          <Link
            href={next && next !== '/' ? `/login?next=${encodeURIComponent(next)}` : '/login'}
            className="inline-block text-sm font-semibold text-text-primary underline underline-offset-4 hover:opacity-80"
          >
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
        href={next && next !== '/' ? next : '/'}
        className="absolute top-8 left-6 md:left-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-text-primary transition z-20"
      >
        <span>←</span> {next && next !== '/' ? 'Kembali' : 'Kembali ke beranda'}
      </Link>

      <div className="login-page-card w-full max-w-md bg-thirdary/60 dark:bg-thirdary/80 border border-text-secondary/15 rounded-2xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-xl font-bold tracking-tight text-text-primary mb-2">
            HAiKAL<span className="text-text-secondary">.</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Daftar Akun</h1>
          <p className="text-sm text-text-secondary mt-1">Bergabung untuk berkomentar dan berinteraksi</p>
        </div>

        <AuthMessage override={state?.error ? { message: state.error, type: 'error' } : null} />

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="next" value={next} />

          <div>
            <label htmlFor="register-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-secondary">Nama Lengkap</label>
            <input
              id="register-name"
              key={state?.email ? `name-${state.name}` : 'register-name'}
              defaultValue={state?.name ?? ''}
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Haikal"
              required
              className="w-full rounded-xl border border-text-secondary/20 bg-background px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-text-primary focus:ring-1 focus:ring-text-primary transition"
            />
          </div>
          <div>
            <label htmlFor="register-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-secondary">Email</label>
            <input
              id="register-email"
              key={state?.email ? `email-${state.email}` : 'register-email'}
              defaultValue={state?.email ?? ''}
              name="email"
              type="email"
              autoComplete="email"
              placeholder="nama@email.com"
              required
              className="w-full rounded-xl border border-text-secondary/20 bg-background px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-text-primary focus:ring-1 focus:ring-text-primary transition"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="register-password" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Password
              </label>
              {password.length > 0 && (
                <span className={`text-[11px] font-mono transition-colors ${password.length >= 72 ? 'text-amber-500 font-bold' : 'text-text-secondary/60'}`}>
                  {password.length}/72
                </span>
              )}
            </div>
            <div className="relative">
              <input
                id="register-password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="6 – 72 karakter"
                required
                minLength={6}
                maxLength={72}
                className={`w-full rounded-xl border bg-background px-4 py-3 pr-11 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none transition ${
                  password.length >= 72
                    ? 'border-amber-500/50 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                    : 'border-text-secondary/20 focus:border-text-primary focus:ring-1 focus:ring-text-primary'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-thirdary/60 transition cursor-pointer"
                aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {password.length >= 72 && (
              <p className="mt-1.5 text-xs text-amber-500 dark:text-amber-400 flex items-center gap-1.5 animate-fade-in font-medium">
                <span>⚠️</span>
                <span>Batas maksimal 72 karakter tercapai.</span>
              </p>
            )}
          </div>

          <SubmitButton />
        </form>

        <p className="mt-8 text-center text-xs text-text-secondary">
          Sudah punya akun?{' '}
          <Link
            href={next && next !== '/' ? `/login?next=${encodeURIComponent(next)}` : '/login'}
            className="font-semibold text-text-primary underline underline-offset-4 hover:opacity-80"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background text-text-secondary text-sm">Memuat...</div>}>
      <RegisterForm />
    </Suspense>
  )
}
