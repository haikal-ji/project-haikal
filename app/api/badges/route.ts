import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

function isOwner(email: string | undefined | null) {
  return Boolean(email && process.env.OWNER_EMAIL && email === process.env.OWNER_EMAIL)
}

// GET: Mengambil semua badge yang tersedia
export async function GET() {
  try {
    const badges = await prisma.badge.findMany({
      orderBy: { created_at: 'asc' },
    })
    return NextResponse.json({ badges })
  } catch (error) {
    console.error('Error fetching badges:', error)
    return NextResponse.json({ error: 'Gagal mengambil data badge' }, { status: 500 })
  }
}

// POST: Membuat badge baru (owner only)
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
    const { name, emoji, color } = body as {
      name?: string
      emoji?: string
      color?: string
    }

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Nama badge harus diisi' }, { status: 400 })
    }

    const badge = await prisma.badge.create({
      data: {
        name: name.trim(),
        emoji: emoji?.trim() || '🏆',
        color: color?.trim() || '#7c4a35',
      },
    })

    return NextResponse.json({ badge }, { status: 201 })
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Badge dengan nama ini sudah ada' }, { status: 400 })
    }
    console.error('Error creating badge:', error)
    return NextResponse.json({ error: 'Gagal membuat badge' }, { status: 500 })
  }
}
