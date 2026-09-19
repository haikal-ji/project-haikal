import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { syncUserToDb } from '@/lib/auth-sync'

// Dipanggil Supabase setelah OAuth / magic link / reset password
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as 'recovery' | 'signup' | 'magiclink' | null
  const rawNext = searchParams.get('next') ?? '/'
  // Hanya izinkan path relatif (harus diawali '/' tapi bukan '//') — cegah open redirect
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/'

  const forwardedHost = request.headers.get('x-forwarded-host')
  const isLocalEnv = process.env.NODE_ENV === 'development'
  const redirectBase = (!isLocalEnv && forwardedHost) ? `https://${forwardedHost}` : origin

  const supabase = await createClient()

  // PKCE OAuth / code flow (Google, GitHub, dsb.)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      await syncUserToDb(supabase)
      return NextResponse.redirect(`${redirectBase}${next}`)
    }
  }

  // Token hash flow (reset password, magic link, email OTP)
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
    if (!error) {
      // Hanya sync user jika bukan recovery (reset password tidak perlu sync)
      if (type !== 'recovery') {
        await syncUserToDb(supabase)
      }
      return NextResponse.redirect(`${redirectBase}${next}`)
    }
  }

  return NextResponse.redirect(`${redirectBase}/login?error=auth-failed`)
}
