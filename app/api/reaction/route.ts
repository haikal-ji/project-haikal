import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { syncUserToDb } from '@/lib/auth-sync'
import { prisma } from '@/lib/prisma'

const validTypes = new Set(['LIKE', 'DISLIKE'])

export async function POST(request: Request) {
  const supabase = await createClient()
  const user = await syncUserToDb(supabase)

  if (!user) {
    return NextResponse.json({ error: 'Kamu harus login dulu untuk memberikan reaksi' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const articleId = typeof body?.article_id === 'string' ? body.article_id : ''
  const type = typeof body?.type === 'string' ? body.type : ''

  if (!articleId || !validTypes.has(type)) {
    return NextResponse.json({ error: 'Data reaction tidak valid' }, { status: 400 })
  }

  const article = await prisma.article.findUnique({ where: { id: articleId }, select: { id: true } })
  if (!article) return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 })

  const existing = await prisma.reaction.findUnique({
    where: { user_id_article_id: { user_id: user.id, article_id: articleId } },
  })

  if (existing && existing.type === type) {
    await prisma.reaction.delete({ where: { id: existing.id } })
  } else if (existing) {
    await prisma.reaction.update({ where: { id: existing.id }, data: { type: type as 'LIKE' | 'DISLIKE' } })
  } else {
    await prisma.reaction.create({
      data: { user_id: user.id, article_id: articleId, type: type as 'LIKE' | 'DISLIKE' },
    })
  }

  const [likeCount, dislikeCount, current] = await Promise.all([
    prisma.reaction.count({ where: { article_id: articleId, type: 'LIKE' } }),
    prisma.reaction.count({ where: { article_id: articleId, type: 'DISLIKE' } }),
    prisma.reaction.findUnique({
      where: { user_id_article_id: { user_id: user.id, article_id: articleId } },
      select: { type: true },
    }),
  ])

  return NextResponse.json({
    likeCount,
    dislikeCount,
    userReaction: current?.type ?? null,
  })
}
