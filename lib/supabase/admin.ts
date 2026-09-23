import { createClient } from '@supabase/supabase-js'

// Client khusus server dengan hak akses penuh (Service Role)
// Digunakan untuk operasi server terverifikasi seperti cleanup storage,
// bypass RLS policies yang memblokir DELETE pada bucket storage.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
  }

  // Gunakan SUPABASE_SERVICE_ROLE_KEY jika tersedia, fallback ke ANON_KEY
  const key = serviceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
