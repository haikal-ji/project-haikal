import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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
    checkRateLimit(request, `POST:/api/articles/view:${id}`, {
      limit: 20,
      windowMs: 60_000,
      identity,
    })
  ) {
    return NextResponse.json({ error: 'Terlalu banyak permintaan, coba lagi nanti' }, { status: 429 })
  }

  try {
    const article = await prisma.article.update({
      where: { id },
      data: { view_count: { increment: 1 } },
      select: { view_count: true },
    })

    return NextResponse.json({ viewCount: article.view_count })
  } catch {
    return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 })
  }
}
