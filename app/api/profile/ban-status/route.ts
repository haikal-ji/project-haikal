import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

// GET: Cek status ban dan appeal aktif milik user yang sedang login
export async function GET() {
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser?.email) {
    return NextResponse.json({ error: 'Harus login' }, { status: 401 })
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: authUser.email },
    select: { id: true, is_banned: true, ban_reason: true },
  })

  if (!dbUser) {
    return NextResponse.json({ is_banned: false, active_appeal: null })
  }

  const activeAppeal = dbUser.is_banned
    ? await prisma.unbanAppeal.findFirst({
        where: { user_id: dbUser.id, status: 'PENDING' },
        orderBy: { created_at: 'desc' },
      })
    : null

  return NextResponse.json({
    is_banned: dbUser.is_banned,
    ban_reason: dbUser.ban_reason,
    active_appeal: activeAppeal,
  })
}
