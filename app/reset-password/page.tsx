'use client'

import { useState, useEffect, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AuthMessage from '@/components/AuthMessage'
import { resetPasswordAction } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-button-hero hover:bg-button-hero-hover text-background dark:text-foreground py-3.5 text-sm font-semibold tracking-wide transition disabled:opacity-50 shadow-md cursor-pointer"
    >
      {pending ? 'Menyimpan...' : 'Simpan Password Baru'}
    </button>
  )
}

export default function ResetPasswordPage() {
  const router = useRouter()
  const [state, formAction] = useActionState(resetPasswordAction, null)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        router.replace('/')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [state?.success, router])

  if (state?.success) {
    return (
      <div className="login-page-shell min-h-screen flex items-center justify-center px-6 py-16 bg-background text-text-primary relative overflow-hidden transition-colors duration-200">
        <div className="login-page-card w-full max-w-md bg-thirdary/60 dark:bg-thirdary/80 border border-text-secondary/15 rounded-2xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
            <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Password berhasil diubah!</h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            Kamu akan diarahkan ke beranda dalam sebentar...
          </p>
          <Link href="/" className="inline-block text-sm font-semibold text-text-primary underline underline-offset-4 hover:opacity-80">
            Ke beranda sekarang
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="login-page-shell min-h-screen flex items-center justify-center px-6 py-16 bg-background text-text-primary relative overflow-hidden transition-colors duration-200">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-text-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="login-page-card w-full max-w-md bg-thirdary/60 dark:bg-thirdary/80 border border-text-secondary/15 rounded-2xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-xl font-bold tracking-tight text-text-primary mb-2">
            HAiKAL<span className="text-text-secondary">.</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Buat Password Baru</h1>
          <p className="text-sm text-text-secondary mt-1">
            Masukkan password baru untuk akunmu
          </p>
        </div>

        <AuthMessage
          override={
            state?.error
              ? {
                  message: state.error,
                  type: 'error',
                  ...(state.error.includes('kedaluwarsa')
                    ? {
                        action: {
                          label: 'Minta link reset baru →',
                          href: '/forgot-password',
                        },
                      }
                    : {}),
                }
              : null
          }
        />

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="reset-password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Password Baru
            </label>
            <div className="relative">
              <input
                id="reset-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Minimal 6 karakter"
                required
                minLength={6}
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
          <div>
            <label htmlFor="reset-confirm" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Konfirmasi Password
            </label>
            <div className="relative">
              <input
                id="reset-confirm"
                name="confirm"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Ulangi password baru"
                required
                minLength={6}
                className="w-full rounded-xl border border-text-secondary/20 bg-background px-4 py-3 pr-11 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-text-primary focus:ring-1 focus:ring-text-primary transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-thirdary/60 transition cursor-pointer"
                aria-label={showConfirm ? 'Sembunyikan konfirmasi password' : 'Lihat konfirmasi password'}
                title={showConfirm ? 'Sembunyikan konfirmasi password' : 'Lihat konfirmasi password'}
              >
                {showConfirm ? (
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
          Kembali ke{' '}
          <Link href="/login" className="font-semibold text-text-primary underline underline-offset-4 hover:opacity-80">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
