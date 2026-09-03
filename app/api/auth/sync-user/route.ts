import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { syncUserToDb } from '@/lib/auth-sync'

// Dipanggil dari halaman login setelah login manual (email+password) berhasil
export async function POST() {
  const supabase = await createClient()
  const user = await syncUserToDb(supabase)

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  return NextResponse.json({ user })
}
