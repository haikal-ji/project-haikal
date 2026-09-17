import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { verifySameOrigin } from '@/lib/csrf'
import { adminBanSchema } from '@/lib/schemas'

function isAdmin(email: string) {
  return email === process.env.OWNER_EMAIL
}

// POST: Ban atau Unban user
export async function POST(request: Request) {
  if (!verifySameOrigin(request)) {
    return NextResponse.json({ error: 'Origin tidak valid' }, { status: 403 })
  }

  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser?.email || !isAdmin(authUser.email)) {
    return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const result = adminBanSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Data tidak valid', details: result.error.flatten() },
      { status: 400 }
    )
  }

  const { userId, reason, unban } = result.data

  try {
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!targetUser) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })
    }

    // Lindungi akun owner agar tidak bisa di-ban
    if (targetUser.email === process.env.OWNER_EMAIL) {
      return NextResponse.json(
        { error: 'Akun Owner utama tidak dapat di-ban' },
        { status: 400 }
      )
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
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })
    }
    console.error('Error ban/unban user:', error)
    return NextResponse.json({ error: 'Gagal memproses permintaan' }, { status: 500 })
  }
}

