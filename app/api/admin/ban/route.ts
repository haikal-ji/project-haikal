import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

function isAdmin(email: string) {
  return email === process.env.OWNER_EMAIL
}

// POST: Ban atau Unban user
export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser?.email || !isAdmin(authUser.email)) {
    return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 })
  }

  const body = await request.json()
  const { userId, reason, unban } = body as {
    userId: string
    reason?: string
    unban?: boolean
  }

  if (!userId) {
    return NextResponse.json({ error: 'userId diperlukan' }, { status: 400 })
  }

  if (unban) {
    // Unban user
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { is_banned: false, ban_reason: null },
    })
    // Tandai semua appeal pending sebagai approved
    await prisma.unbanAppeal.updateMany({
      where: { user_id: userId, status: 'PENDING' },
      data: { status: 'APPROVED', reviewed_at: new Date() },
    })
    revalidatePath('/dashboard/komunitas')
    return NextResponse.json({ user: updated })
  }

  // Ban user
  if (!reason?.trim()) {
    return NextResponse.json({ error: 'Alasan ban diperlukan' }, { status: 400 })
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { is_banned: true, ban_reason: reason.trim() },
  })

  revalidatePath('/dashboard/komunitas')
  return NextResponse.json({ user: updated })
}
