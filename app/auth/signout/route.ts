import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

async function handleSignOut(request: Request) {
  const { origin } = new URL(request.url)
  const supabase = await createClient()

  // 1. Sign out dari Supabase Auth
  await supabase.auth.signOut()

  // 2. Hapus semua cookie auth yang mungkin tersisa di browser
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()
  for (const c of allCookies) {
    if (c.name.startsWith('sb-') || c.name.includes('auth-token')) {
      cookieStore.delete(c.name)
    }
  }

  // Jika dipanggil via AJAX/fetch JSON
  if (request.headers.get('accept')?.includes('application/json')) {
    return NextResponse.json({ success: true })
  }

  return NextResponse.redirect(`${origin}/login`, { status: 303 })
}

export async function POST(request: Request) {
  return handleSignOut(request)
}

export async function GET(request: Request) {
  return handleSignOut(request)
}
