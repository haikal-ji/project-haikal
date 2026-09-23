'use client'

import { useState, useActionState, Suspense } from 'react'
import { useFormStatus } from 'react-dom'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import AuthMessage from '@/components/AuthMessage'
import { loginAction } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-button-hero hover:bg-button-hero-hover text-background dark:text-foreground py-3.5 text-sm font-semibold tracking-wide transition disabled:opacity-50 shadow-md cursor-pointer"
    >
      {pending ? 'Memproses...' : 'Login'}
    </button>
  )
}

function LoginForm() {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const rawNext = searchParams.get('next') || searchParams.get('redirectTo') || '/'
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/'

  const [state, formAction] = useActionState(loginAction, null)
  const [showPassword, setShowPassword] = useState(false)
  const [oauthError, setOauthError] = useState<string | null>(null)
  const [oauthLoading, setOauthLoading] = useState<'github' | 'google' | null>(null)

  async function handleGithubLogin() {
    setOauthError(null)
    setOauthLoading('github')
    const callbackUrl = new URL('/auth/callback', window.location.origin)
    if (next && next !== '/') {
      callbackUrl.searchParams.set('next', next)
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: callbackUrl.toString(),
      },
    })
    if (error) {
      setOauthError(error.message)
      setOauthLoading(null)
    }
  }

  async function handleGoogleLogin() {
    setOauthError(null)
    setOauthLoading('google')
    const callbackUrl = new URL('/auth/callback', window.location.origin)
    if (next && next !== '/') {
      callbackUrl.searchParams.set('next', next)
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl.toString(),
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account consent',
        },
      },
    })
    if (error) {
      setOauthError(error.message)
      setOauthLoading(null)
    }
  }

  const errorMessage = state?.error || oauthError

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
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Selamat Datang</h1>
          <p className="text-sm text-text-secondary mt-1">Masuk ke akun kamu untuk berinteraksi</p>
        </div>

        <AuthMessage override={errorMessage ? { message: errorMessage, type: 'error' } : null} />

        <div className="space-y-3">
          {/* Tombol Google */}
          <button
            type="button"
            disabled={oauthLoading !== null}
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-text-secondary/20 bg-background hover:bg-thirdary px-4 py-3 text-sm font-semibold text-text-primary transition disabled:opacity-50 shadow-sm"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{oauthLoading === 'google' ? 'Mengarahkan...' : 'Lanjutkan dengan Google'}</span>
          </button>

          {/* Tombol GitHub */}
          <button
            type="button"
            disabled={oauthLoading !== null}
            onClick={handleGithubLogin}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#24292f] hover:bg-[#1b1f23] text-white border border-black/20 dark:border-white/10 px-4 py-3 text-sm font-semibold transition disabled:opacity-50 shadow-sm cursor-pointer"
          >
            <svg className="h-4 w-4 fill-white shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            <span className="!text-white">{oauthLoading === 'github' ? 'Mengarahkan...' : 'Lanjutkan dengan GitHub'}</span>
          </button>
        </div>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-text-secondary/15" />
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">atau email</span>
          <div className="h-px flex-1 bg-text-secondary/15" />
        </div>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="next" value={next} />

          <div>
            <label htmlFor="login-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-secondary">Email</label>
            <input
              id="login-email"
              key={state?.email ?? 'login-email'}
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
              <label htmlFor="login-password" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">Password</label>
              <Link href="/forgot-password" className="text-xs text-text-secondary hover:text-text-primary transition underline underline-offset-4">
                Lupa password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-text-secondary/20 bg-background px-4 py-3 pr-11 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-text-primary focus:ring-1 focus:ring-text-primary transition"
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
          </div>

          <SubmitButton />
        </form>

        <p className="mt-8 text-center text-xs text-text-secondary">
          Belum punya akun?{' '}
          <Link
            href={next && next !== '/' ? `/register?next=${encodeURIComponent(next)}` : '/register'}
            className="font-semibold text-text-primary underline underline-offset-4 hover:opacity-80"
          >
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background text-text-secondary text-sm">Memuat...</div>}>
      <LoginForm />
    </Suspense>
  )
}
