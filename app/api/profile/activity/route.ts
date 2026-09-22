import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import type { ReactionType } from '@prisma/client'

const LIKED_TYPES: ReactionType[] = ['LIKE']

export async function GET(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !user.email) {
    return NextResponse.json({ error: 'Harus login' }, { status: 401 })
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
    select: { id: true },
  })

  if (!dbUser) {
    return NextResponse.json({ error: 'Pengguna tidak ditemukan' }, { status: 404 })
  }

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'comments'
  const skip = Math.max(0, parseInt(searchParams.get('skip') || '0', 10) || 0)
  const take = Math.min(50, Math.max(1, parseInt(searchParams.get('take') || '10', 10) || 10))

  if (type === 'comments') {
    const [items, total] = await Promise.all([
      prisma.comment.findMany({
        where: { user_id: dbUser.id },
        include: {
          article: {
            select: { id: true, title: true },
          },
        },
        orderBy: { created_at: 'desc' },
        skip,
        take,
      }),
      prisma.comment.count({
        where: { user_id: dbUser.id },
      }),
    ])

    const formattedItems = items.map((c) => ({
      id: c.id,
      content: c.content,
      createdAt: new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date(c.created_at)),
      article: {
        id: c.article.id,
        title: c.article.title,
      },
    }))

    const hasMore = skip + items.length < total

    return NextResponse.json({
      items: formattedItems,
      hasMore,
      total,
    })
  } else if (type === 'likes') {
    const whereCondition = {
      user_id: dbUser.id,
      type: { in: LIKED_TYPES },
    }

    const items = await prisma.reaction.findMany({
      where: whereCondition,
      include: {
        article: {
          select: { id: true, title: true, created_at: true },
        },
      },
      orderBy: { created_at: 'desc' },
      skip,
      take,
    })

    const total = await prisma.reaction.count({
      where: whereCondition,
    })

    const formattedItems = items.map((r) => ({
      id: r.article.id,
      title: r.article.title,
      createdAt: new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date(r.article.created_at)),
    }))

    const hasMore = skip + items.length < total

    return NextResponse.json({
      items: formattedItems,
      hasMore,
      total,
    })
  }

  return NextResponse.json({ error: 'Tipe aktivitas tidak valid' }, { status: 400 })
}
