import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { verifySameOrigin } from '@/lib/csrf'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!verifySameOrigin(request)) {
    return NextResponse.json({ error: 'Origin tidak valid' }, { status: 403 })
  }

  const { id } = await params

  // Ambil user jika login untuk identitas rate limit yang lebih akurat
  const supabase = await createClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
  const identity = authUser ? `user:${authUser.id}` : `ip:${ip}`

  if (
    checkRateLimit(request, `POST:/api/articles/share:${id}`, {
      limit: 10,
      windowMs: 60_000,
      identity,
    })
  ) {
    return NextResponse.json({ error: 'Terlalu banyak permintaan, coba lagi nanti' }, { status: 429 })
  }

  try {
    const updated = await prisma.article.update({
      where: { id },
      data: {
        share_count: {
          increment: 1,
        },
      },
      select: {
        share_count: true,
      },
    })

    return NextResponse.json({ success: true, shareCount: updated.share_count })
  } catch (err: any) {
    console.error('Share error:', err)
    return NextResponse.json({ error: err?.message || 'Gagal' }, { status: 500 })
  }
}
