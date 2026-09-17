'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { mapAuthError } from '@/lib/auth-errors'

export interface ForgotPasswordActionState {
  error?: string | null
  submitted?: boolean
  email?: string
}

export async function forgotPasswordAction(
  prevState: ForgotPasswordActionState | null,
  formData: FormData
): Promise<ForgotPasswordActionState> {
  const email = (formData.get('email') as string)?.trim() ?? ''

  if (!email) {
    return {
      error: 'Email wajib diisi.',
      email,
    }
  }

  const headerList = await headers()
  const forwardedHost = headerList.get('x-forwarded-host')
  const host = forwardedHost || headerList.get('host')
  const proto = headerList.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http')
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
