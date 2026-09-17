'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import AuthMessage from '@/components/AuthMessage'
import { forgotPasswordAction } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-button-hero hover:bg-button-hero-hover text-background dark:text-foreground py-3.5 text-sm font-semibold tracking-wide transition disabled:opacity-50 shadow-md cursor-pointer"
    >
      {pending ? 'Mengirim...' : 'Kirim link reset'}
    </button>
  )
}

export default function ForgotPasswordPage() {
  const [state, formAction] = useActionState(forgotPasswordAction, null)

  if (state?.submitted) {
    return (
      <div className="login-page-shell min-h-screen flex items-center justify-center px-6 py-16 bg-background text-text-primary relative overflow-hidden transition-colors duration-200">
        <div className="login-page-card w-full max-w-md bg-thirdary/60 dark:bg-thirdary/80 border border-text-secondary/15 rounded-2xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
            <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Cek email kamu</h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            Jika email tersebut terdaftar, link untuk reset password sudah dikirim ke{' '}
            <span className="font-semibold text-text-primary">{state.email}</span>.
            Klik link tersebut untuk membuat password baru.
          </p>
          <Link
            href="/login"
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
        href="/login"
        className="absolute top-8 left-6 md:left-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-text-primary transition z-20"
      >
        <span>←</span> Kembali ke login
      </Link>

      <div className="login-page-card w-full max-w-md bg-thirdary/60 dark:bg-thirdary/80 border border-text-secondary/15 rounded-2xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-xl font-bold tracking-tight text-text-primary mb-2">
            HAiKAL<span className="text-text-secondary">.</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Lupa Password</h1>
          <p className="text-sm text-text-secondary mt-1">
            Masukkan email kamu dan kami akan kirim link untuk reset password
          </p>
        </div>

        <AuthMessage override={state?.error ? { message: state.error, type: 'error' } : null} />

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="forgot-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Email
            </label>
            <input
              id="forgot-email"
              key={state?.email ?? 'forgot-email'}
              defaultValue={state?.email ?? ''}
              name="email"
              type="email"
              autoComplete="email"
              placeholder="nama@email.com"
              required
              className="w-full rounded-xl border border-text-secondary/20 bg-background px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-text-primary focus:ring-1 focus:ring-text-primary transition"
            />
          </div>

          <SubmitButton />
        </form>

        <p className="mt-8 text-center text-xs text-text-secondary">
          Ingat passwordnya?{' '}
          <Link href="/login" className="font-semibold text-text-primary underline underline-offset-4 hover:opacity-80">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
