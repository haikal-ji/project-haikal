import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { syncUserToDb } from '@/lib/auth-sync'
import { verifySameOrigin } from '@/lib/csrf'
import { checkRateLimit } from '@/lib/rate-limit'

// Dipanggil dari halaman login setelah login manual (email+password) berhasil
export async function POST(request: Request) {
  if (!verifySameOrigin(request)) {
    return NextResponse.json({ error: 'Origin tidak valid' }, { status: 403 })
  }

  if (checkRateLimit(request, 'POST:/api/auth/sync-user', { limit: 5, windowMs: 60_000 })) {
    return NextResponse.json({ error: 'Terlalu banyak permintaan, coba lagi nanti' }, { status: 429 })
  }

  const supabase = await createClient()
  const user = await syncUserToDb(supabase)

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  return NextResponse.json({ user })
}

