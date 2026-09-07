import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

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
