import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { verifySameOrigin } from '@/lib/csrf'
import { checkRateLimit } from '@/lib/rate-limit'
import { createBadgeSchema } from '@/lib/schemas'

function isOwner(email: string | undefined | null) {
  return Boolean(email && process.env.OWNER_EMAIL && email === process.env.OWNER_EMAIL)
}

// GET: Mengambil semua badge yang tersedia
export async function GET(request: Request) {
  if (checkRateLimit(request, 'GET:/api/badges', { limit: 30, windowMs: 60_000 })) {
    return NextResponse.json({ error: 'Terlalu banyak permintaan, coba lagi nanti' }, { status: 429 })
  }

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
  if (!verifySameOrigin(request)) {
    return NextResponse.json({ error: 'Origin tidak valid' }, { status: 403 })
  }

  try {
    const supabase = await createClient()
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!isOwner(authUser?.email)) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 })
    }

    const body = await request.json().catch(() => null)
    const result = createBadgeSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Data tidak valid', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const { name, emoji, color } = result.data

    const badge = await prisma.badge.create({
      data: {
        name,
        emoji: emoji || '🏆',
        color: color || '#7c4a35',
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

