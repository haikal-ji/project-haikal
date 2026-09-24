'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { syncUserToDb } from '@/lib/auth-sync'
import { mapAuthError } from '@/lib/auth-errors'
import { checkRateLimitByIp } from '@/lib/rate-limit'

export interface RegisterActionState {
  error?: string | null
  requiresConfirmation?: boolean
  email?: string
  name?: string
}

export async function registerAction(
  prevState: RegisterActionState | null,
  formData: FormData
): Promise<RegisterActionState> {
  const headersList = await headers()
  const forwarded = headersList.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'

  // 3 pendaftaran per 10 menit per IP — mencegah spam akun massal
  if (checkRateLimitByIp(ip, 'POST:/register', { limit: 3, windowMs: 10 * 60_000 })) {
    return {
      error: 'Terlalu banyak percobaan pendaftaran. Tunggu beberapa menit sebelum mencoba lagi.',
    }
  }

  const name = (formData.get('name') as string)?.trim() ?? ''
  const email = (formData.get('email') as string)?.trim() ?? ''
  const password = (formData.get('password') as string) ?? ''

  if (!email || !password) {
    return {
      error: 'Email dan password wajib diisi.',
      name,
      email,
    }
  }

  if (password.length < 6) {
    return {
      error: 'Password minimal harus 6 karakter.',
      name,
      email,
    }
  }

  if (password.length > 72) {
    return {
      error: 'Password maksimal 72 karakter.',
      name,
      email,
    }
  }

  const rawNext = (formData.get('next') as string)?.trim() || '/'
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/'

  const forwardedHost = headersList.get('x-forwarded-host') || headersList.get('host')
  const proto = headersList.get('x-forwarded-proto') || 'https'
  const origin = forwardedHost ? `${proto}://${forwardedHost}` : ''
  const emailRedirectTo = origin
    ? `${origin}/auth/callback${next !== '/' ? `?next=${encodeURIComponent(next)}` : ''}`
    : undefined

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name || email },
      emailRedirectTo,
    },
  })

  if (error) {
    return {
      error: mapAuthError(error.message),
      name,
      email,
    }
  }

  // Jika Supabase mengembalikan session (Confirm email nonaktif di dashboard)
  if (data.session) {
    await syncUserToDb(supabase)
    redirect(next)
  }

  // Jika Confirm email masih aktif di Supabase
  return {
    requiresConfirmation: true,
    email,
  }
}
