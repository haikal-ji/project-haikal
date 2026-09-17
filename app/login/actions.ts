'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { syncUserToDb } from '@/lib/auth-sync'
import { mapAuthError } from '@/lib/auth-errors'

export interface LoginActionState {
  error?: string | null
  email?: string
}

export async function loginAction(
  prevState: LoginActionState | null,
  formData: FormData
): Promise<LoginActionState> {
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
