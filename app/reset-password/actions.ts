'use server'

import { createClient } from '@/lib/supabase/server'
import { mapAuthError } from '@/lib/auth-errors'

export interface ResetPasswordActionState {
  error?: string | null
  success?: boolean
}

export async function resetPasswordAction(
  prevState: ResetPasswordActionState | null,
  formData: FormData
): Promise<ResetPasswordActionState> {
  const password = formData.get('password') as string
  const confirm = formData.get('confirm') as string

  if (!password || !confirm) {
    return { error: 'Password dan konfirmasi wajib diisi.' }
  }

  if (password !== confirm) {
    return { error: 'Password dan konfirmasi tidak cocok.' }
  }

  if (password.length < 6) {
    return { error: 'Password minimal 6 karakter.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return {
      error: error.message.includes('Auth session missing')
        ? 'Link reset sudah kedaluwarsa atau tidak valid. Silakan minta link baru.'
        : mapAuthError(error.message),
    }
  }

  return { success: true }
}
