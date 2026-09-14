import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { verifySameOrigin } from '@/lib/csrf'
import { checkRateLimit } from '@/lib/rate-limit'
import { createAppealSchema, reviewAppealSchema } from '@/lib/schemas'

// POST: User yang ter-banned mengajukan banding/appeal
export async function POST(request: Request) {
  if (!verifySameOrigin(request)) {
    return NextResponse.json({ error: 'Origin tidak valid' }, { status: 403 })
  }

  if (checkRateLimit(request, 'POST:/api/admin/appeal', { limit: 3, windowMs: 60_000 })) {
    return NextResponse.json({ error: 'Terlalu banyak permintaan, coba lagi nanti' }, { status: 429 })
  }

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

  const body = await request.json().catch(() => null)
  const result = createAppealSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Data tidak valid', details: result.error.flatten() },
      { status: 400 }
    )
  }

  const { reason } = result.data

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
  if (!verifySameOrigin(request)) {
    return NextResponse.json({ error: 'Origin tidak valid' }, { status: 403 })
  }

  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser?.email || authUser.email !== process.env.OWNER_EMAIL) {
    return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const result = reviewAppealSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Data tidak valid', details: result.error.flatten() },
      { status: 400 }
    )
  }

  const { appealId, action, adminNote } = result.data

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

