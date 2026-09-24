import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { syncUserToDb } from '@/lib/auth-sync'
import { prisma } from '@/lib/prisma'
import { verifySameOrigin } from '@/lib/csrf'
import { checkRateLimit } from '@/lib/rate-limit'
import { articleSchema } from '@/lib/schemas'
import { sanitizeArticleHtml } from '@/lib/sanitize'

async function requireOwner() {
  const supabase = await createClient()
  const dbUser = await syncUserToDb(supabase)

  if (!dbUser || dbUser.email !== process.env.OWNER_EMAIL) {
    return null
  }

  return dbUser
}

export async function GET(request: Request) {
  if (checkRateLimit(request, 'GET:/api/articles', { limit: 30, windowMs: 60_000 })) {
    return NextResponse.json({ error: 'Terlalu banyak permintaan, coba lagi nanti' }, { status: 429 })
  }

  const articles = await prisma.article.findMany({
    orderBy: { created_at: 'desc' },
  })
  return NextResponse.json({ articles })
}

export async function POST(request: Request) {
  if (!verifySameOrigin(request)) {
    return NextResponse.json({ error: 'Origin tidak valid' }, { status: 403 })
  }

  const owner = await requireOwner()

  if (!owner) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const result = articleSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Data tidak valid', details: result.error.flatten() },
      { status: 400 }
    )
  }

  const { title, content, thumbnail, category } = result.data

  const article = await prisma.article.create({
    data: {
      title,
      content: sanitizeArticleHtml(content),
      thumbnail: thumbnail || null,
      category: category || 'Tech',
      author_id: owner.id,
    },
  })

  return NextResponse.json({ article })
}

