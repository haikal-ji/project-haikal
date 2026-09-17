'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { syncUserToDb } from '@/lib/auth-sync'
import { mapAuthError } from '@/lib/auth-errors'

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

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name || email },
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
    redirect('/')
  }

  // Jika Confirm email masih aktif di Supabase
  return {
    requiresConfirmation: true,
    email,
  }
}
