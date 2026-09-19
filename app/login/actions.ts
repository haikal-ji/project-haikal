'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { syncUserToDb } from '@/lib/auth-sync'
import { mapAuthError } from '@/lib/auth-errors'
import { checkRateLimitByIp } from '@/lib/rate-limit'

export interface LoginActionState {
  error?: string | null
  email?: string
}

export async function loginAction(
  prevState: LoginActionState | null,
  formData: FormData
): Promise<LoginActionState> {
  const headersList = await headers()
  const forwarded = headersList.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'

  // 5 percobaan per menit per IP — proteksi brute force
  if (checkRateLimitByIp(ip, 'POST:/login', { limit: 5, windowMs: 60_000 })) {
    return {
      error: 'Terlalu banyak percobaan login. Tunggu 1 menit sebelum mencoba lagi.',
    }
  }

  const email = (formData.get('email') as string)?.trim() ?? ''
  const password = (formData.get('password') as string) ?? ''

  if (!email || !password) {
    return {
      error: 'Email dan password wajib diisi.',
      email,
    }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return {
      error: mapAuthError(error.message),
      email,
    }
  }

  await syncUserToDb(supabase)

  redirect('/')
}
