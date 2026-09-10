import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

// POST: User yang ter-banned mengajukan banding/appeal
export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser?.email) {
    return NextResponse.json({ error: 'Harus login' }, { status: 401 })
  }

  const dbUser = await prisma.user.findUnique({ where: { email: authUser.email } })

  if (!dbUser) {
    return NextResponse.json({ error: 'Akun tidak ditemukan' }, { status: 401 })
  }

  if (!dbUser.is_banned) {
    return NextResponse.json({ error: 'Akun kamu tidak sedang di-banned' }, { status: 400 })
  }

  const body = await request.json()
  const { reason } = body as { reason: string }

  if (!reason?.trim() || reason.trim().length < 20) {
    return NextResponse.json(
      { error: 'Alasan permohonan harus diisi minimal 20 karakter' },
      { status: 400 }
    )
  }

  // Cek apakah sudah ada appeal PENDING aktif
  const existingAppeal = await prisma.unbanAppeal.findFirst({
    where: { user_id: dbUser.id, status: 'PENDING' },
  })

  if (existingAppeal) {
    return NextResponse.json(
      { error: 'Kamu sudah memiliki permohonan yang sedang ditinjau. Tunggu hasilnya.' },
      { status: 400 }
    )
  }

  const appeal = await prisma.unbanAppeal.create({
    data: {
      user_id: dbUser.id,
      reason: reason.trim(),
      status: 'PENDING',
    },
  })

  revalidatePath('/dashboard/komunitas')
  return NextResponse.json({ appeal })
}

// PATCH: Admin menyetujui atau menolak appeal
export async function PATCH(request: Request) {
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser?.email || authUser.email !== process.env.OWNER_EMAIL) {
    return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 })
  }

  const body = await request.json()
  const { appealId, action, adminNote } = body as {
    appealId: string
    action: 'APPROVED' | 'REJECTED'
    adminNote?: string
  }

  if (!appealId || !['APPROVED', 'REJECTED'].includes(action)) {
    return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 })
  }

  const appeal = await prisma.unbanAppeal.findUnique({ where: { id: appealId } })
  if (!appeal) {
    return NextResponse.json({ error: 'Appeal tidak ditemukan' }, { status: 404 })
  }

  const updatedAppeal = await prisma.unbanAppeal.update({
    where: { id: appealId },
    data: {
      status: action,
      admin_note: adminNote?.trim() || null,
      reviewed_at: new Date(),
    },
  })

  // Jika disetujui, langsung unban user-nya
  if (action === 'APPROVED') {
    await prisma.user.update({
      where: { id: appeal.user_id },
      data: { is_banned: false, ban_reason: null },
    })
  }

  revalidatePath('/dashboard/komunitas')
  return NextResponse.json({ appeal: updatedAppeal })
}
