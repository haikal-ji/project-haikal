import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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
