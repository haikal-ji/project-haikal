import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

function isOwner(email: string | undefined | null) {
  return Boolean(email && process.env.OWNER_EMAIL && email === process.env.OWNER_EMAIL)
}

// POST: Memberikan badge ke user (owner only)
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!isOwner(authUser?.email)) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 })
    }

    const body = await request.json()
    const { user_id, badge_id } = body as {
      user_id?: string
      badge_id?: string
    }

    if (!user_id || !badge_id) {
      return NextResponse.json({ error: 'user_id dan badge_id diperlukan' }, { status: 400 })
    }

    const userBadge = await prisma.userBadge.create({
      data: {
        user_id,
        badge_id,
      },
      include: {
        badge: true,
      },
    })

    revalidatePath('/dashboard/komunitas')
    revalidatePath('/artikel')

    return NextResponse.json({ userBadge }, { status: 201 })
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Pengguna sudah memiliki badge ini' },
        { status: 400 }
      )
    }
    console.error('Error assigning badge:', error)
    return NextResponse.json({ error: 'Gagal memberikan badge' }, { status: 500 })
  }
}

// DELETE: Melepas assignment badge dari user (owner only)
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!isOwner(authUser?.email)) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID assignment badge diperlukan' }, { status: 400 })
    }

    await prisma.userBadge.delete({
      where: { id },
    })

    revalidatePath('/dashboard/komunitas')
    revalidatePath('/artikel')

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error removing user badge:', error)
    return NextResponse.json({ error: 'Gagal mencabut badge' }, { status: 500 })
  }
}
