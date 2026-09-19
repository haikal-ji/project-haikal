'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { mapAuthError } from '@/lib/auth-errors'
import { checkRateLimitByIp } from '@/lib/rate-limit'

export interface ForgotPasswordActionState {
  error?: string | null
  submitted?: boolean
  email?: string
}

export async function forgotPasswordAction(
  prevState: ForgotPasswordActionState | null,
  formData: FormData
): Promise<ForgotPasswordActionState> {
  const headersList = await headers()
  const forwarded = headersList.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'

  // 3 request per 10 menit per IP — mencegah email bombing
  if (checkRateLimitByIp(ip, 'POST:/forgot-password', { limit: 3, windowMs: 10 * 60_000 })) {
    return {
      error: 'Terlalu banyak permintaan reset password. Tunggu beberapa menit sebelum mencoba lagi.',
    }
  }

  const email = (formData.get('email') as string)?.trim() ?? ''

  if (!email) {
    return {
      error: 'Email wajib diisi.',
      email,
    }
  }

  const forwardedHost = headersList.get('x-forwarded-host')
  const host = forwardedHost || headersList.get('host')
  const proto = headersList.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http')
  const origin = `${proto}://${host}`

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  })

  if (error) {
    return {
      error: mapAuthError(error.message),
      email,
    }
  }

  return {
    submitted: true,
    email,
  }
}
