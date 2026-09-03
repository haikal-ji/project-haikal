import { createBrowserClient } from '@supabase/ssr'

// Dipakai di Client Component (mis. halaman login/register)
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
