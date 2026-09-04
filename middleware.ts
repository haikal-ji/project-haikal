import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)

  // Proteksi khusus halaman dashboard: cuma pemilik (OWNER_EMAIL) yang boleh akses
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const ownerEmail = process.env.OWNER_EMAIL

    if (!user || user.email !== ownerEmail) {
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
