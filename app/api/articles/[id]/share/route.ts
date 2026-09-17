import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (checkRateLimit(request, 'POST:/api/articles/share', { limit: 10, windowMs: 60_000 })) {
    return NextResponse.json({ error: 'Terlalu banyak permintaan, coba lagi nanti' }, { status: 429 })
  }

  const { id } = await params

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
